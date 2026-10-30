---
weight: 1005
title: Partner Integrations
---

# Partner Integrations

A partner is an application that uses PaperOS data inside its own features.
It can use its own login system and run on PaperOS infrastructure or elsewhere.
Its users do not need a separate "Connect PaperOS" interaction. The application's
credentials, its links to PaperOS users, and each user's workspace access determine
what it can request.

<aside class="notice">
The integration MCP tools, dashboard workflow, and deploy integration APIs
were deployed on October 30, 2026. Runtime availability and served dashboard
assets were verified. Real setup completion, customer account creation,
workspace-token issuance, and customer data calls have not been verified end to end.
The existing PaperOS registration and linked-user endpoints are separate from
those additions. The public workspace-token exchange used by the new MCP tools
is staging-first; use a compatible PaperOS environment.
</aside>

The workflow is:

1. Choose the PaperOS workspace that will own the application registration.
2. List its existing integrations. Reuse the right registration, or register
   once and save its client ID and secret on your backend.
3. Request admin setup using those application credentials. An admin performs
   the existing setup procedure; the ticket reports its progress.
4. After setup, create new PaperOS users through the integration endpoint or
   use users already linked to the application. Look up their subjects and
   available workspaces when needed.
5. Request a token for the linked subject and selected workspace, then call
   the API from your backend. Validate the token against the endpoint family
   you intend to use; see [compatibility limits](#partner-workspace-tokens).

The workspace owning the registration is not an allowlist of customer data
workspaces. A later token request checks both the application's link to the
subject and that subject's access to the requested workspace.

## Register through the dashboard

For an interactive workflow, the deploy dashboard's **Partner integrations** page
is [available here](https://deploy.onpaper.co/dashboard/integrations.html).
Use your PaperOS sign-in, choose the workspace that will own the registration,
and select an existing app or register a new one with its name and actual HTTPS
redirect URLs. You can reveal and copy its client ID and secret for your app's
backend secret store. Registration requires full access to the owning workspace;
it does not require an app deployment or GitHub connection.

The selected registration then supplies credentials for requesting admin setup
and manually refreshing the ticket's status. The optional linked-users step
shows the application's subjects and their workspaces. Its JSON export contains
`{"client_id":"oidc_...","subjects":[...]}`. The app secret stays in page memory,
outside the export and browser storage. The exported list contains customer data; store it only where
your integration needs it. Admin setup itself remains manual.

The page uses the same operations and permissions described below. Direct API
and MCP workflows remain available without using the dashboard. The dashboard
does not create customer accounts or issue customer workspace tokens; use the
documented API or MCP tools for those operations.

## Select the owning workspace

For direct HTTP registration, start with a developer's PaperOS user token and
[`GET /api/v1/orgs?updated_since=0`](https://dev.paperos.com/#list-orgs). Choose a
returned public `org_...` ID. Registration requires full access in that workspace.

Obtain an account-scoped developer token through the public endpoint below.
This is a registration prerequisite, not a partner end-user token exchange.
The same account token authenticates registration, listing, and credential recovery.

```shell
# PAPEROS_USER_TOKEN comes from the developer's authenticated PaperOS session.
# OWNER_ORG_ID is the chosen workspace returned by List Orgs.
# Use a private file outside source control for this token response.
umask 077
curl --fail-with-body -X POST \
    "${PAPEROS_BASE_URL}/api/v1/orgs/${OWNER_ORG_ID}/access-token" \
    -H "Authorization: Bearer ${PAPEROS_USER_TOKEN}" \
    --output "${PAPEROS_OWNER_TOKEN_FILE}"
```

```javascript
// Node.js backend only. Keep the response out of logs and browser responses.
const scopeResponse = await fetch(
   `${paperBase}/api/v1/orgs/${encodeURIComponent(ownerOrgId)}/access-token`,
   { method: "POST", headers: { Authorization: `Bearer ${paperosUserToken}` } },
);
if (!scopeResponse.ok) throw new Error(`Workspace access failed: ${scopeResponse.status}`);
const { access_token: ownerToken } = await scopeResponse.json();
```

> Response from the public workspace-token endpoint:

```json
{
   "access_token": "<OWNER_WORKSPACE_TOKEN>",
   "token_type": "Bearer",
   "expires_in": 3600,
   "org_id": "org_01ewdxxpvgg2y19pbtbyddtvv8",
   "account_id": 97
}
```

`expires_in` is the remaining lifetime and can be shorter than 3600 seconds.
Use `access_token` as `PAPEROS_OWNER_TOKEN` in the
[registration](#registration), [list](#list), and
[credential recovery](#get-registration-and-recover-credentials) examples.
The registration-owning workspace is selected by this token, not by adding
an `owner_org_id` field to the PaperOS registration request body.

## Agents using deploy MCP

Connect the PaperOS deploy MCP server with the developer's PaperOS OAuth account.
No deployed app or GitHub connection is required for these integration tools.

| Tool | Purpose |
| --- | --- |
| `get_paperos_api_integration_guide(topic="partner-integration")` | Read this workflow as Markdown. |
| `list_paperos_workspaces()` | Find accessible workspaces before selecting an owner. |
| `list_paperos_integrations(owner_org_id)` | Find existing registrations; this tool omits secrets. |
| `get_paperos_integration(owner_org_id, client_id)` | Explicitly recover an existing registration's credentials. |
| `register_paperos_integration(owner_org_id, client_name, redirect_uris, contacts=None, client_uri=None)` | Create one registration and return its generated credentials. |
| `request_paperos_integration_setup(client_id, client_secret)` | Create or reuse the app's manual admin setup ticket. |
| `get_paperos_integration_setup_status(client_id, client_secret)` | Read that ticket's processing/completed status. |
| `list_paperos_integration_users(client_id, client_secret)` | List linked subjects and their accessible workspaces. |
| `create_paperos_integration_user(client_id, client_secret, external_id, email, locale, zoneinfo, given_name=None, family_name=None, email_verified=None)` | Create a new linked PaperOS account; existing emails are rejected. |
| `get_paperos_integration_workspace_token(client_id, client_secret, org_id, auth_time, exp, amr, sub=None, external_id=None)` | Request a workspace token using one linked subject selector and actual app authentication claims. |

The registration tools use the connected developer's OAuth token to call
`POST /api/v1/orgs/{owner_org_id}/access-token`, then use the returned account
token with `/api/v1/oidc/clients`. The intermediate account token stays inside
the tool. These tools do not use the developer's GitHub identity or require a
deployment.

`list_paperos_workspaces` returns `workspaces`; `list_paperos_integrations`
returns `owner_org_id` and `integrations`. Registration and explicit recovery
return `owner_org_id` and one `integration`, with credentials in that object:

```json
{
   "owner_org_id": "org_01ewdxxpvgg2y19pbtbyddtvv8",
   "integration": {
      "client_id": "oidc_example",
      "client_name": "Example App",
      "redirect_uris": ["https://app.example.com/callback"],
      "requestable_scopes": ["profile"],
      "client_secret": "<CLIENT_SECRET>",
      "client_secret_expires_at": 0
   }
}
```

Optional registered metadata can also be present. This is the MCP tool result;
the raw [PaperOS registration response](#registration) is a bare client object
with HTTP201.

Use the app's actual name and a real HTTPS redirect URI supplied by its developer
or configuration. The existing web-client API requires `redirect_uris` even
for a backend integration that will not use an interactive redirect. Do not
invent a callback URL or submit an example domain as a real registration.

Registration and explicit recovery return secrets. Save them in the app's
backend secret store; do not repeat them in chat, logs, committed files, or
browser code. If a create call times out, list existing integrations before
trying again. Registration is not idempotent and must not be retried automatically.

The guide tool reads Markdown shipped with the MCP server. It does not scrape
this website, and it can serve its installed guide even when the website is
unavailable. Docs releases and MCP releases must carry the same contract.
The setup tools and customer-operation tools use the registered app's client
ID and secret. Registration does not automatically call them. They return the
existing ticket, linked-subject, created-subject, or token payloads documented
below, without an extra wrapper. The connected developer's MCP login is not a
substitute for the customer's authentication context when issuing a token.
Use only the tools advertised by your connected server; an older server may not
expose these additions yet.

## Request admin setup

The deploy service accepts the registered application's **client ID and secret**.
This request does not use a developer login, workspace ownership token, GitHub
connection, or deployment ID. The registered app supplies the identity; callers
cannot override the app or its metadata in the body.

Set `DEPLOY_BASE_URL` to the deploy service exposing this feature. This is a
different service from `PAPEROS_BASE_URL`.

Agents use `request_paperos_integration_setup(client_id, client_secret)` and
`get_paperos_integration_setup_status(client_id, client_secret)`. Both return
the same ticket payload as the HTTP calls below. They submit/read the request;
an admin still performs setup manually. Report `processing` as pending admin
work, not a completed integration.

> `POST /api/integrations/setup-request` on the deploy service

```shell
curl --fail-with-body -X POST "${DEPLOY_BASE_URL}/api/integrations/setup-request" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}" \
    -H 'Content-Type: application/json' \
    -d '{}'
```

```javascript
// Node.js backend only.
const setupResponse = await fetch(`${deployBase}/api/integrations/setup-request`, {
   method: "POST",
   headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/json",
   },
   body: JSON.stringify({}),
});
const setup = await setupResponse.json();
if (!setupResponse.ok) throw new Error(`Setup request failed: ${setupResponse.status}`);
```

> `GET /api/integrations/setup-request` reads the current ticket using the same credentials.

```shell
curl --fail-with-body "${DEPLOY_BASE_URL}/api/integrations/setup-request" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}"
```

> Both successful calls return HTTP200 and this shape:

```json
{
   "ticket_id": "11111111-1111-4111-8111-111111111111",
   "ticket_number": 42,
   "client_id": "oidc_example",
   "status": "processing",
   "ticket_status": "open",
   "created_at": "2026-10-29T12:00:00Z",
   "closed_at": null
}
```

The POST accepts `{}` or no body. It reuses the application's existing ticket,
including a completed ticket. An admin performs the existing integration setup
and closes the ticket; `status` then becomes `completed`, `ticket_status` becomes
`closed`, and `closed_at` contains the closure time. Reopening the ticket returns
it to `processing`. `open` and `in_progress` both map to `processing`.
Closing the ticket records the admin's decision; the endpoint does not itself
enable impersonation, run a setup script, or link users.

The ticket contains registered app metadata and has no human login identity.
It is separate from the ordinary support-ticket limit. No client secret is
sent to PaperPilot or returned in this status response.

Errors use `{"error":"message"}`:400 for a nonempty/invalid body,401 for invalid
app credentials,404 when GET finds no ticket,503 when the ticket service is not
configured, and502 when an upstream response cannot be confirmed. Responses
use `Cache-Control: no-store`. After an uncertain POST result, read the status
before submitting again.

<aside class="warning">
Source review found that PaperOS's existing client inspection endpoint can
disclose registered secrets after an incorrect password. The new deploy handler
compares the supplied secret with the returned active secrets, but that does
not repair the upstream disclosure. This remains an unresolved release blocker
before exposing the workflow. This finding is from source and local tests,
not a live authentication test.
</aside>

## Linked users and workspace selection

After the application's required grants are enabled, use
[`POST /api/v1/integrations/users`](#create-subject-user) to create **new** PaperOS
users. Creation links the new user to the calling application and returns
`subject.sub`. Existing emails are rejected; the create endpoint does not claim
or automatically link an existing PaperOS account. Existing-user links require
the current administrative provisioning procedure.

The MCP equivalent is
`create_paperos_integration_user(client_id, client_secret, external_id, email, locale, zoneinfo, given_name=None, family_name=None, email_verified=None)`.
The four account fields `external_id`, `email`, `locale`, and `zoneinfo` are
required; names and the boolean `email_verified` are optional. Supply real
account details and assert email verification only when it occurred. The result
is the same `success`, `type`, and `subject` response as the API, including
`subject.sub` and initially empty `orgs`. Creating a user does not create a
workspace. After an uncertain creation result, list and reconcile before retrying.

[`GET /api/v1/integrations/users`](#list-subjects-users) returns only subjects
linked to the calling application, with their email, `sub`, optional
`external_id`, and `orgs`. Match a shared account by its email, then select the
requested public `org_...` ID from that subject's `orgs`. A user may have several
workspaces. This endpoint does not accept an email lookup parameter; filtering
the returned list happens in your backend.

Agents use `list_paperos_integration_users(client_id, client_secret)`, which
returns the same `success`, `type`, and `subjects` response as the API. The
dashboard's `GET /api/integrations/users` on the deploy host is a read-only
proxy with Basic app credentials and that same payload. Its responses use
`Cache-Control: no-store`; errors use `{"error":"message"}`. There are no deploy
REST wrappers for creating customer accounts or issuing their tokens: direct
HTTP clients use the existing PaperOS endpoints.

## Partner workspace tokens

The existing [`POST /api/v1/integrations/access-token`](#create-access-token)
uses Basic application credentials and selects one linked subject with either
`claims.sub.value` or `claims.external_id.value`, plus `claims.org_id.value` for
the workspace. It checks the app's permission for that subject and the subject's
workspace access before issuance. Email plus workspace is not a supported
shortcut request body.

The MCP tool is
`get_paperos_integration_workspace_token(client_id, client_secret, org_id, auth_time, exp, amr, sub=None, external_id=None)`.
Supply **exactly one** of `sub` or `external_id`. The tool builds the API's
`claims` body and returns the same `{"access_token":"..."}` result. It checks
the existing authorization; it does not create a link or workspace membership.

This endpoint also validates authentication claims such as `auth_time`, `exp`,
and `amr`; follow its documented request contract using the app's actual login
context. When a token expires, the backend requests a replacement with valid
credentials and claims. This is not the OAuth refresh-token grant and does not
require passing the app's Supabase login token to PaperOS.

`auth_time` and `exp` are integer Unix seconds. The existing endpoint requires
`auth_time` before now and within 24 hours plus 15 seconds, and `exp` after
`auth_time` by less than that interval. `exp` is an authentication assertion,
not an override of the issued token's lifetime. `amr` is a nonempty list of
supported methods that actually occurred, such as `pwd` for a password login.
Never substitute the developer's MCP login or invent fresh claims to bypass
these checks. A stale app authentication context cannot support replacement
issuance merely by retrying it unchanged.

Keep issued tokens in the backend and associate them with the client, subject,
and workspace they represent. Do not reuse one token across unrelated workspaces.
The legacy partner token and the modern Developer API have known compatibility
and workspace-scoping differences. Issuing a workspace token does not demonstrate
that every reports, records, or batch endpoint accepts it correctly. Preserve
the [existing scoping caveats](https://dev.paperos.com/#current-workspace-scoping-limitations)
and verify the intended endpoint in the chosen environment before enabling data writes.
