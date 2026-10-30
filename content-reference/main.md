---
weight: 1000
title: API Reference
---

# Introduction

Welcome to the PaperOS API!

<aside class="notice">New here? Start with the <a href="/">Quickstart</a> for data APIs and the SSO gate, or <a href="#partner-integrations">Partner Integrations</a> for an app using its own login. This page is the full reference.</aside>

You can view code examples in the dark area to the right, and you can switch the programming language of the examples with the tabs in the top right.

**This example API documentation page was created with [DocuAPI](https://github.com/bep/docuapi/), a multilingual documentation theme for the static site generator [Hugo Extended Edition](http://webinstall.dev/hugo-extended/).**

## Prerequisites

> Install the tools used in the examples

```sh
curl https://webi.sh/jq@1 | sh
curl https://webi.sh/node@lts | sh

source ~/.local/envman/PATH.sh
```

Please install `jq` and `node` to follow along in the examples.

## API Base URL

> The Base URL will be in the form of

```text
https://app.paperos.com
https://example.c.paperos.com
https://paperos.example.com
https://demo.example.c.paperos.net
```

> Use `example.c.paperos.dev` (note: `.dev`) for the live examples:

```sh
export PAPEROS_BASE_URL='https://example.c.paperos.dev'
```

```javascript
var paperBase = process.env.PAPEROS_BASE_URL;
```

Depending on your account, your PaperOS base URL may resemble any of the following:

- https://app.paperos.com
- https://example.c.paperos.com
- https://paperos.example.com

For general operations you can always use `https://app.paperos.com`, however, using the branded domain may be required for certain actions, such as those that generate branded notifications.

Your Sandbox base URL may look something like `https://demo.example.c.paperos.net`.

<!-- ## API Introspection

These are DEBUG ENDPOINTS and MAY CHANGE at any time. Use them where it helps, but DO NOT RELY ON them.

> `GET /api/v1/schema`

```shell
curl -s "https://app.paperos.com/api/v1/schema" |
   jq -r '.record_types[].type'
```

```javascript
var recordTypesUrl = "https://app.paperos.com/api/v1/schema";
var recordResp = await fetch(recordTypesUrl);
var recordData = await recordResp.json();

console.info(`Record Types:`);
for (let recordType of recordData.record_types) {
   console.info(`   ${recordType.type}`);
}
```

> `GET /api/v1/schema/individual`

```shell
b_record_type='individual'
curl -s "https://app.paperos.com/api/v1/schema/${b_record_type}" |
   jq -r '.field_types[].type'
```

```javascript
var recordType = "individual";
var fieldTypesUrl = `https://app.paperos.com/api/v1/schema/${recordType}`;
var fieldResp = await fetch(fieldTypesUrl);
var fieldData = await fieldResp.json();

console.info(`Record Types for '${recordType}':`);
for (let fieldType of fieldData.field_types) {
   console.info(`   ${fieldType.type}`);
}
```

> Example

```shell
curl -s "https://app.paperos.com/api/v1/schema" |
   jq -r '.record_types[].type' |
   while read b_type; do
      echo ""
      echo "### Record Type: ${b_type}"
      echo "### Fields:"
      curl -s "https://app.paperos.com/api/v1/schema/${b_type}" |
         jq -r '.field_types[].type'
   done
```

```javascript
var recordTypesUrl = "https://app.paperos.com/api/v1/schema";
var resp = await fetch(recordTypesUrl);
var data = await resp.json();

for (let recordType of data.record_types) {
   console.info("");
   console.info(`Record Type '${recordType.type}':`);

   let fieldTypesUrl = `https://app.paperos.com/api/v1/schema/${recordType.type}`;
   let fieldResp = await fetch(fieldTypesUrl);
   let fieldData = await fieldResp.json();

   for (let fieldType of fieldData.field_types) {
      console.info(`   ${fieldType.type}`);
   }
}
``` -->

## To-Dos

There are multiple things that need to have public-facing IDs and slugs and name changes:

- Needs truncated responses
   - tasks, transactions
   - lots of things
- Needs Segmentation
   - Individual
- Needs Slugs (or Enums)
   - `role_id` (maybe?)
   - `investor_documents_list` (`"All of the above"`, etc)
   - `upload_or_generate` (`"Generate"`, etc)

# OIDC Client

Our goal is Just Works™ compatibility with OIDC clients for:

- [OIDC Section 2: ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)
   - [RFC 7638 Section 1: JWK Key ID (kid)](https://www.rfc-editor.org/rfc/rfc7638.html#section-1)
   - [RFC 7638 Section 3: JWK Thumbprint](https://www.rfc-editor.org/rfc/rfc7638.html#section-3.2)
- [OIDC Section 3.1: Authorization Code Flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)
- [OIDC Section 3.2: Implicit Flow](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth)
- [OIDC Section 5.1: Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)
   - [RFC 8176: AMR (Authentication Method Reference) Values](https://www.rfc-editor.org/rfc/rfc8176.html)
- [OIDC Dynamic Client Registration 1.0 incorporating errata set 2](https://openid.net/specs/openid-connect-registration-1_0.html)

However, as the spec is large and many pieces are sections have been superseded by other methodologies or unadopted in industry, we implement functionality as needed.

Please report any incompatibility with compliant clients to support as a bug.

## Registration

Register the application in a PaperOS workspace where the developer has full
access. First [select the owning workspace](#select-the-owning-workspace) and
obtain its account-scoped developer token. Use that token as
`PAPEROS_OWNER_TOKEN` below. Registration itself does not require partner
impersonation to be enabled.

List existing registrations before creating one. A new registration starts
with `requestable_scopes: ["profile"]`; use its generated client credentials to
[request admin setup](#request-admin-setup) for the additional partner access.
Registration does not automatically enable impersonation or link existing users.

The request requires a nonempty `redirect_uris` array. For a web client, provide
the app's actual HTTPS callback URI even if this backend integration will not
use redirects. The domains below are documentation examples; an agent must
obtain real values before calling the registration tool. Optional metadata may
be omitted; it is not necessary to supply every example field.

This POST is not idempotent. If its outcome is uncertain, list registrations
and recover the existing client's credentials before attempting another create.
Set `PAPEROS_CLIENT_FILE` to a private file outside source control; the response
contains a secret.

> `POST /api/v1/oidc/clients`

```shell
umask 077
curl --fail-with-body -X POST "${PAPEROS_BASE_URL}/api/v1/oidc/clients" \
    -H "Authorization: Bearer ${PAPEROS_OWNER_TOKEN}" \
    -H 'Content-Type: application/json' \
    --output "${PAPEROS_CLIENT_FILE}" \
    -d '{
           "redirect_uris": ["https://app.example.com/callback", "https://app.example.com/return"],
           "response_types": ["code"],
           "grant_types": ["authorization_code"],
           "contacts": ["devops@example.com"],
           "client_name": "Example App",
           "logo_uri": "https://app.example.com/logo.png",
           "client_uri": "https://app.example.com",
           "policy_uri": "https://app.example.com/privacy",
           "tos_uri": "https://app.example.com/terms",
           "sector_identifier_uri": "https://example.com/allowed_redirects.json",
           "initiate_login_uri": "https://app.example.com/oidc/start"
        }'
```

```javascript
var data = {
   redirect_uris: [
      "https://app.example.com/callback",
      "https://app.example.com/return",
   ],
   response_types: ["code"],
   grant_types: ["authorization_code"],
   contacts: ["devops@example.com"],
   client_name: "Example App",
   logo_uri: "https://app.example.com/logo.png",
   client_uri: "https://app.example.com",
   policy_uri: "https://app.example.com/privacy",
   tos_uri: "https://app.example.com/terms",
   sector_identifier_uri: "https://example.com/allowed_redirects.json",
   initiate_login_uri: "https://app.example.com/oidc/start",
};
var payload = JSON.stringify(data, null, 2);

var url = `${paperBase}/api/v1/oidc/clients`;
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Bearer ${ownerToken}`,
      "Content-Type": "application/json",
   },
   body: payload,
});
if (!resp.ok) throw new Error(`Registration failed: ${resp.status}`);
var oidcClient = await resp.json();
// Save oidcClient.client_id and client_secret in the backend's secret store.
// Do not log this object or return it to the browser.
```

> HTTP201 response (example secret redacted):

```json
{
   "rp_id": "ocrp_zdcw9paqtecqby8c",
   "sector_identifier": "a468aa0d-97ff-4b92-849e-63fe7f6b1817",
   "redirect_uris": [
      "https://app.example.com/callback",
      "https://app.example.com/return"
   ],
   "response_types": ["code"],
   "grant_types": ["authorization_code"],
   "application_type": "web",
   "contacts": ["devops@example.com"],
   "client_name": "Example App",
   "logo_uri": "https://app.example.com/logo.png",
   "client_uri": "https://app.example.com",
   "policy_uri": "https://app.example.com/privacy",
   "tos_uri": "https://app.example.com/terms",
   "jwks_uri": null,
   "subject_type": "pairwise",
   "token_endpoint_auth_method": "client_secret_basic",
   "default_max_age": 0,
   "require_auth_time": true,
   "initiate_login_uri": "https://app.example.com/oidc/start",
   "requestable_scopes": ["profile"],
   "client_secret": "<CLIENT_SECRET>",
   "client_secret_expires_at": 0,
   "client_id": "oidc_pc2tsa5rd1m4tamb",
   "client_id_issued_at": 1745559634
}
```

Caveats:

- typically, you **should not** create multiple clients, as they will have **different pairwise identifiers**
- as we rely exclusively on HTTPS for encryption, we do not support many of the optional JWE- and JWS-related options

For more information on the meaning of the various fields, and additional available fields, see the Client Metadata glossary:

- <https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata>

## List

Use the owning workspace's developer token. The raw PaperOS response includes
credentials; the examples below remove them before displaying metadata.
The MCP `list_paperos_integrations(owner_org_id)` tool also omits secrets.

> `GET /api/v1/oidc/clients`

```shell
curl --fail-with-body "${PAPEROS_BASE_URL}/api/v1/oidc/clients" \
    -H "Authorization: Bearer ${PAPEROS_OWNER_TOKEN}" |
    jq '{success, total, type, oidc_clients: [.oidc_clients[] | del(.client_secret, .secrets)], count}'
```

```javascript
var url = `${paperBase}/api/v1/oidc/clients`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${ownerToken}` },
});
if (!resp.ok) throw new Error(`List integrations failed: ${resp.status}`);
var oidcClients = await resp.json();
var integrations = oidcClients.oidc_clients.map(({ client_secret, secrets, ...app }) => app);
// Display integrations only; do not log the credential-bearing raw response.
```

> Raw HTTP200 response shape, before the examples remove secrets:

```json
{
   "success": true,
   "total": 1,
   "type": "[]<oidc_client>",
   "oidc_clients": [
      {
         "client_id": "oidc_zdcw93k7h4w4zb2m",
         "rp_id": "ocrp_zdcw9paqtecqby8c",
         "org_id": "org_01he3t2sjcs6zybd2cemyvn7qn",
         "external_id": null,
         "sector_identifier": "15e4cd2d-22e8-4f47-b9ca-8b80d7b4a870",
         "redirect_uris": [
            "https://app.example.com/callback",
            "https://app.example.com/return"
         ],
         "response_types": ["code"],
         "grant_types": ["authorization_code"],
         "application_type": "web",
         "contacts": ["devops@example.com"],
         "client_name": "Example App",
         "logo_uri": "https://app.example.com/logo.png",
         "client_uri": "https://app.example.com",
         "policy_uri": "https://app.example.com/privacy",
         "tos_uri": "https://app.example.com/terms",
         "jwks_uri": null,
         "sector_identifier_uri": null,
         "subject_type": "pairwise",
         "token_endpoint_auth_method": "client_secret_basic",
         "default_max_age": 0,
         "require_auth_time": true,
         "initiate_login_uri": "https://app.example.com/oidc/start",
         "requestable_scopes": ["profile", "impersonation"],
         "client_id_issued_at": 1745455434,
         "secrets": [
            {
               "id": "occs_zdcw9631vkaf4ppk",
               "secret": "<CLIENT_SECRET>",
               "comment": "",
               "expires_at": null,
               "created_at": "2025-04-23T18:43:54Z",
               "revoked_at": null
            }
         ],
         "client_secret_expires_at": 0,
         "client_secret": "<CLIENT_SECRET>"
      }
   ],
   "count": 1
}
```

Extensions:

- multiple secrets: we support multiple secrets to allow for a grace period during rotation

## Get registration and recover credentials

Use this explicitly when you need an existing application's credentials.
The developer must have access to the registration in its owning workspace.
It is different from authenticating a setup request with the app's credentials.

> `GET /api/v1/oidc/clients/{client_id}`

```shell
umask 077
curl --fail-with-body "${PAPEROS_BASE_URL}/api/v1/oidc/clients/${CLIENT_ID}" \
    -H "Authorization: Bearer ${PAPEROS_OWNER_TOKEN}" \
    --output "${PAPEROS_CLIENT_FILE}"
```

```javascript
// Node.js backend only; ownerToken is the developer's scoped account token.
const response = await fetch(`${paperBase}/api/v1/oidc/clients/${encodeURIComponent(clientId)}`, {
   headers: { Authorization: `Bearer ${ownerToken}` },
});
if (!response.ok) throw new Error(`Get integration failed: ${response.status}`);
const registration = await response.json();
if (!registration.oidc_client) throw new Error("Integration not found in this workspace");
// Store registration.oidc_client credentials securely; never log this response.
```

> HTTP200 response, showing the identity and credential fields (other registered metadata is omitted here):

```json
{
   "success": true,
   "type": "<oidc_client>",
   "oidc_client": {
      "id": "oidc_zdcw93k7h4w4zb2m",
      "org_id": "org_01he3t2sjcs6zybd2cemyvn7qn",
      "client_name": "Example App",
      "requestable_scopes": ["profile"],
      "revoked_at": null,
      "secrets": [
         {
            "id": "occs_zdcw9631vkaf4ppk",
            "secret": "<CLIENT_SECRET>",
            "comment": "",
            "expires_at": null,
            "created_at": "2025-04-23T18:43:54Z",
            "revoked_at": null
         }
      ],
      "client_secret": "<CLIENT_SECRET>",
      "client_secret_expires_at": 0
   }
}
```

The raw single-client endpoint uses `oidc_client.id`; registration and list
responses use `client_id`. The current raw endpoint can return HTTP200 with
no `oidc_client` when nothing matches. Check the object, not just the status.
The new MCP `get_paperos_integration(owner_org_id, client_id)` tool normalizes
the ID to `client_id` and rejects missing or revoked integrations, or registrations
without an active credential.

## Create Subject (User)

This endpoint requires the application's impersonation grant. It creates a new
PaperOS user and links that user to the calling application; it rejects an email
that already exists. It does not create a workspace or automatically claim an
existing account. Preserve the returned `subject.sub` for later token requests. In the backend
examples below, `clientId` and `clientSecret` come from your saved application
credentials; `paperBase` is `process.env.PAPEROS_BASE_URL`.

> `POST /api/v1/integrations/users`

```shell
curl --fail-with-body -X POST "${PAPEROS_BASE_URL}/api/v1/integrations/users" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}" \
    -H 'Content-Type: application/json' \
    -d '{
           "external_id": "john_doe-101",
           "email": "john.doe+101@example.com",
           "email_verified": false,
           "given_name": "John",
           "family_name": "Doe",
           "zoneinfo": "America/Denver",
           "locale": "en-US"
        }' | jq
```

```javascript
var intlData = Intl.DateTimeFormat().resolvedOptions();
var data = {
   external_id: "john_doe-101",
   email: "john.doe+101@example.com",
   email_verified: false,
   given_name: "John",
   family_name: "Doe",
   zoneinfo: intlData.timeZone,
   locale: intlData.locale,
};
var payload = JSON.stringify(data, null, 2);

var url = `${paperBase}/api/v1/integrations/users`;
// Node.js backend only.
var basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
   },
   body: payload,
});

var subjectResp = await resp.json();
// Save subjectResp.subject.sub alongside the app account; do not log user payloads.
```

> Example Result:

```json
{
   "success": true,
   "type": "<oidc_subject>",
   "subject": {
      "oidc_client_id": "oidc_zdcw93k7h4w4zb2m",
      "sub": "sub_159rjy10v4qpfr0d",
      "external_id": "john_doe-101",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe+101@example.com",
      "phone": null,
      "zoneinfo": "America/Denver",
      "locale": "en-US",
      "picture": null,
      "granted_scopes": ["profile", "impersonation"],
      "orgs": [],
      "created_at": "2025-04-25 08:31:23Z",
      "updated_at": "2025-04-25 08:31:23Z"
   }
}
```

## Update Subject (User)

Set the user's `externalId` as well as their current `locale` and `zoneinfo`.

This is primarily for the initial user sync.

> `PATCH /api/v1/integrations/users/:sub`

```shell
b_ppid_sub='sub_xxxxxxxx'
b_our_id='100-john_doe'

curl --fail-with-body -X PATCH "${PAPEROS_BASE_URL}/api/v1/integrations/users/${b_ppid_sub}" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}" \
    -H 'Content-Type: application/json' \
    -d '{
           "external_id": "'"${b_our_id}"'",
           "locale": "en-US",
           "zoneinfo": "America/Denver"
        }' | jq
```

```javascript
var ppidSub = "sub_xxxxxxxx";
var ourId = "100-john_doe";

var intlData = Intl.DateTimeFormat().resolvedOptions();
var data = {
   external_id: ourId,
   locale: intlData.locale,
   zoneinfo: intlData.timeZone,
};
var payload = JSON.stringify(data, null, 2);

var url = `${paperBase}/api/v1/integrations/users/${ppidSub}`;
// Node.js backend only.
var basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
var resp = await fetch(url, {
   method: "PATCH",
   headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
   },
   body: payload,
});

console.log("OK:", resp.status, resp.ok);
```

> Example Result:

```text
204 NO CONTENT
```

## List Subjects (Users)

Returns users already linked to this application, including their email, `sub`,
`external_id`, and accessible workspaces in `orgs`. Match the shared email in your
backend, then use that subject and the chosen workspace ID. There is no email
lookup parameter on this endpoint.

> `GET /api/v1/integrations/users`

```shell
curl --fail-with-body "${PAPEROS_BASE_URL}/api/v1/integrations/users" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/integrations/users`;
// Node.js backend only.
var basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
var resp = await fetch(url, {
   headers: { Authorization: `Basic ${basicAuth}` },
});
```

> Example Response:

```json
{
   "success": true,
   "type": "<[]oidc_subject>",
   "subjects": [
      {
         "given_name": "John",
         "family_name": "Doe",
         "email": "john.doe+101@example.com",
         "locale": "en-US",
         "zoneinfo": "America/Denver",
         "external_id": "john_doe-101",
         "sub": "sub_d0255a8r3hknnzsh",
         "granted_scopes": ["profile", "impersonation"],
         "orgs": [
            {
               "id": "org_ew421jr4pmnhs02z",
               "name": "My For Profit OIDC Client Test Co"
            }
         ]
      }
   ]
}
```

# Authentication

This reference describes the **registered OIDC client** integration: your
backend uses its client ID and secret to request tokens representing a subject.
It is separate from the **paper-deploy SSO gate** flow, where the signed-in
user's OAuth access token arrives in a backend request header.

See [Partner Integrations](#partner-integrations) for registration, admin setup,
linked subjects, and the release status of the new MCP/setup additions.

For a deployed app behind that gate, start with the
[quickstart authentication guide](https://dev.paperos.com/#authentication). Use the gate's token
directly for workspace data requests; do not first call the client-credential
endpoints below to obtain an ID token or an account token.

When using an account-scoped token, keep its account aligned with the workspace
in the request URL. Current records routes can retain the token's account when
the URL differs, while newer reports/batch routes can re-scope after checking
membership. See the [current scoping limitations](https://dev.paperos.com/#current-workspace-scoping-limitations);
do not treat account scoping as an exclusive delegation boundary.

> Set Organization-Scoped Access Token

```sh
export OIDC_ACCESS_TOKEN='xxxx.yyyy.zzzz'
```

```javascript
var paperToken = process.env.OIDC_ACCESS_TOKEN;
```

<!--
<form id="-paper-init">
    <label>Base URL:
        <input
            type="url"
            placeholder="https://example.c.paperos.dev"
            value="https://example.c.paperos.dev"
        />
    </label>
    <label>API Token:
        <input
            type="text"
            pattern="p[A-Za-z0-9]{1,}_[A-Za-z0-9]{32,}"
            placeholder="ppt_7COQmKv8EUi95AkGYDRXjsfI7ZamHr9o0I8D0072uo"
            value="ppt_7COQmKv8EUi95AkGYDRXjsfI7ZamHr9o0I8D0072uo"
        />
    </label>
</form>
<script>
  (function () {
    'use strict';

    let $form = document.body.querySelector('#-paper-init');

}());
</script>
-->

PaperOS data requests use an API token in the Authorization header with the
`Bearer` prefix. Registration uses a developer's account-scoped Bearer token;
the `/integrations/users` and `/integrations/*-token` endpoints below use
HTTP Basic application credentials.

`Authorization: Bearer <token>`

<aside class="notice">
Client secrets and tokens belong only on the backend. Never expose them to
browser JavaScript, log them, or embed them in URLs. The client-credential
flow below is not the OAuth authorization-code exchange or the optional
<a href="https://dev.paperos.com/#optional-account-scoped-access-token">workspace access-token endpoint</a>.
</aside>

## Create ID Token

The ID Token represents the subject (user) and can be used to create an organization.

Use exactly one subject selector: `claims.sub.value` from the linked-user list,
or the application's `claims.external_id.value`. The examples use `external_id`.
`AUTH_TIME`/`authTime` must be the app's actual recent authentication time in Unix
seconds; `TOKEN_EXPIRES_AT`/`expiresAt` must be later and within the server's
24-hour limit. `AUTH_METHOD`/`authMethod` must describe the real authentication
method (for example, `pwd` for password). Do not invent a fresh login time to
bypass these checks. Set `PAPEROS_TOKEN_FILE` to a private file outside source control.

> `POST /api/v1/integrations/id-token`

```shell
umask 077
curl --fail-with-body -X POST "${PAPEROS_BASE_URL}/api/v1/integrations/id-token" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}" \
    -H "Content-Type: application/json" \
    --data "$(jq -n --arg external_id "$EXTERNAL_ID" \
        --argjson auth_time "$AUTH_TIME" --argjson exp "$TOKEN_EXPIRES_AT" \
        --arg amr "$AUTH_METHOD" \
        '{claims: {external_id: {value: $external_id}, auth_time: {value: $auth_time},
                   exp: {value: $exp}, amr: {values: [$amr]}}}')" \
    --output "${PAPEROS_TOKEN_FILE}"
```

```javascript
var payload = JSON.stringify(
   {
      claims: {
         external_id: { value: "john_doe-101" },
         auth_time: { value: authTime },
         exp: { value: expiresAt },
         amr: { values: [authMethod] },
      },
   },
   null,
   2,
);

var url = `${paperBase}/api/v1/integrations/id-token`;
// Node.js backend only.
var basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
   },
   body: payload,
});

var idTokenResult = await resp.json();
// Keep idTokenResult.id_token on the backend; do not log or return it to the browser.
```

> Example Response:

```json
{
   "id_token": "<ID_TOKEN>"
}
```

## Create Access Token

The access token represents access to a specific organization through the
subject (user). This client-credential endpoint returns an `access_token`, not
an ID token. It is different from a normal reports request, which returns data.

Use the actual authentication claims described under [Create ID Token](#create-id-token)
and a workspace from the selected linked subject's `orgs`. Set `PAPEROS_TOKEN_FILE`
to a private file outside source control. Compatibility with newer data endpoints
must be checked separately; see [Partner workspace tokens](#partner-workspace-tokens).

> `POST /api/v1/integrations/access-token`

```shell
umask 077
curl --fail-with-body -X POST "${PAPEROS_BASE_URL}/api/v1/integrations/access-token" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}" \
    -H "Content-Type: application/json" \
    --data "$(jq -n --arg external_id "$EXTERNAL_ID" --arg org_id "$ORG_ID" \
        --argjson auth_time "$AUTH_TIME" --argjson exp "$TOKEN_EXPIRES_AT" \
        --arg amr "$AUTH_METHOD" \
        '{claims: {external_id: {value: $external_id}, org_id: {value: $org_id},
                   auth_time: {value: $auth_time}, exp: {value: $exp}, amr: {values: [$amr]}}}')" \
    --output "${PAPEROS_TOKEN_FILE}"
```

```javascript
var payload = JSON.stringify(
   {
      claims: {
         external_id: { value: "john_doe-101" },
         org_id: { value: "org_ew421jr4pmnhs02z" },
         auth_time: { value: authTime },
         exp: { value: expiresAt },
         amr: { values: [authMethod] },
      },
   },
   null,
   2,
);

var url = `${paperBase}/api/v1/integrations/access-token`;
// Node.js backend only.
var basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
   },
   body: payload,
});

var accessTokenResult = await resp.json();
// Keep accessTokenResult.access_token on the backend; do not log or return it to the browser.
```

> Example Response:

```json
{
   "access_token": "<WORKSPACE_ACCESS_TOKEN>"
}
```

## Inspect Token

This is an internal diagnostic route, not a supported Developer API integration
dependency. Apps should use the documented `/api/v1/*` routes.

> `GET /api/user/debug`

```shell
curl --fail-with-body "${PAPEROS_BASE_URL}/api/user/debug" \
  -H "Authorization: Bearer ${OIDC_ACCESS_TOKEN}" |
  jq
```

```javascript
var url = `${paperBase}/api/user/debug`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${paperToken}` },
});
var data = await resp.json();
```

> Example Response:

```json
{
   "user": {
      "account_id": null,
      "partner_id": null,
      "auth_time": "2023-09-19T22:25:54.000Z",
      "iat": "2023-09-19T22:25:54.000Z",
      "exp": null,
      "api_token": true,
      "email": "services+test1@savvi.legal"
   },
   "method": "GET",
   "originalUrl": "/api/user/debug"
}
```

Use the _user_ and _account_ debug endpoints to inspect details of the token.
