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
The registration MCP tools and deploy setup-request API described here are new
local implementation work and have not been released or verified end to end.
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
The registration tools do not themselves submit or complete admin setup;
the HTTP setup workflow follows below.

## Request admin setup

The deploy service accepts the registered application's **client ID and secret**.
This request does not use a developer login, workspace ownership token, GitHub
connection, or deployment ID. The registered app supplies the identity; callers
cannot override the app or its metadata in the body.

Set `DEPLOY_BASE_URL` to the deploy service exposing this feature. This is a
different service from `PAPEROS_BASE_URL`.

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

[`GET /api/v1/integrations/users`](#list-subjects-users) returns only subjects
linked to the calling application, with their email, `sub`, optional
`external_id`, and `orgs`. Match a shared account by its email, then select the
requested public `org_...` ID from that subject's `orgs`. A user may have several
workspaces. This endpoint does not accept an email lookup parameter; filtering
the returned list happens in your backend.

## Partner workspace tokens

The existing [`POST /api/v1/integrations/access-token`](#create-access-token)
uses Basic application credentials and selects one linked subject with either
`claims.sub.value` or `claims.external_id.value`, plus `claims.org_id.value` for
the workspace. It checks the app's permission for that subject and the subject's
workspace access before issuance. Email plus workspace is not a supported
shortcut request body.

This endpoint also validates authentication claims such as `auth_time`, `exp`,
and `amr`; follow its documented request contract using the app's actual login
context. When a token expires, the backend requests a replacement with valid
credentials and claims. This is not the OAuth refresh-token grant and does not
require passing the app's Supabase login token to PaperOS.

Keep issued tokens in the backend and associate them with the client, subject,
and workspace they represent. Do not reuse one token across unrelated workspaces.
The legacy partner token and the modern Developer API have known compatibility
and workspace-scoping differences. Issuing a workspace token does not demonstrate
that every reports, records, or batch endpoint accepts it correctly. Preserve
the [existing scoping caveats](https://dev.paperos.com/#current-workspace-scoping-limitations)
and verify the intended endpoint in the chosen environment before enabling data writes.
