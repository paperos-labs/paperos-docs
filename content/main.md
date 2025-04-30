---
weight: 1000
title: API Reference
---

# Introduction

Welcome to the PaperOS API!

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

## API Introspection

These are DEBUG ENDPOINTS and MAY CHANGE at any time. Use them where it helps, but DO NOT RELY ON them.

> GET /api/v1/schema

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

> GET /api/v1/schema/indv

```shell
b_record_type='indv'
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
```

## To-Dos

There are a lot of things that need to have public-facing IDs and slugs and name changes:

- Needs truncated responses
   - tasks, transactions, projects
   - lots of things
- Needs Public IDs
   - `user_id`
   - `org_id` (`account_id`)
   - `partner_id`
   - `brand_id`
   - `document_id`
- Needs Segmentation
   - Individual
- Needs Slugs (or Enums)
   - `role_id` (maybe?)
   - `resource_type_id`
   - `feature_type_id` (1, 349, 729)
   - `templatee_id` (2, 127)
   - `employee_documents_list` (`"All of the above"`, etc)
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

In general, you should **contact support** to create and configure your OIDC Client.

Although you can create your own client with your user Access Token, it will have minimal permissions and **may not be useful**.

> `POST /api/v1/oidc/clients`

```shell
curl --fail-with-body -X POST "${PAPEROS_BASE_URL}/api/v1/oidc/clients" \
    -H "Authorization: Bearer ${UI_ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
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
      Authorization: `Bearer ${uiAccessToken}`,
      "Content-Type": "application/json",
   },
   body: payload,
});
var oidcClient = await resp.json();

console.log(oidcClient);
```

> Example Response:

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
   "client_secret": "86fa1382-055c-492d-9f0b-7fc0963ca0c7",
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

> `GET /api/v1/oidc/clients`

```shell
curl --fail-with-body "${PAPEROS_BASE_URL}/api/v1/oidc/clients" \
    -H "Authorization: Bearer ${UI_ACCESS_TOKEN}"
```

```javascript
var url = `${paperBase}/api/v1/oidc/clients`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${uiAccessToken}` },
});
var oidcClients = await resp.json();

console.log(oidcClients);
```

> Example Response:

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
               "secret": "9ba82b72-38eb-4a6d-bc57-bace7a0d5bd1",
               "comment": "",
               "expires_at": null,
               "created_at": "2025-04-23T18:43:54Z",
               "revoked_at": null
            }
         ],
         "client_secret_expires_at": 0,
         "client_secret": "9ba82b72-38eb-4a6d-bc57-bace7a0d5bd1"
      }
   ],
   "count": 1
}
```

Extensions:

- multiple secrets: we support multiple secrets to allow for a grace period during rotation

## Create Subject (User)

> `POST /api/v1/integrations/users`

```shell
curl -v --fail-with-body -X POST "${PAPEROS_BASE_URL}/api/v1/integrations/users" \
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

var url = `${PAPEROS_BASE_URL}/api/v1/integrations/users`;
var basicAuth = btoa(`${oidc.client_id}:${oidc.client_secret}`);
var resp = await fetch(url, {
   method: "POST",
   credentials: "include",
   headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
   },
   body: payload,
});

var subjectResp = await resp.json();
console.log(subjectResp);
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

## List Subjects (Users)

> `GET /api/v1/integrations/users`

```shell
curl --fail-with-body "${PAPEROS_BASE_URL}/api/v1/integrations/users" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}" |
    jq
```

```javascript
var url = `${PAPEROS_BASE_URL}/api/v1/integrations/users`;
var basicAuth = btoa(`${oidc.client_id}:${oidc.client_secret}`);
var resp = await fetch(url, {
   credentials: "include",
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

> Use your own API Token, or this example token:

```sh
export PAPEROS_API_TOKEN='ppt_7COQmKv8EUi95AkGYDRXjsfI7ZamHr9o0I8D0072uo'
```

```javascript
var paperToken = process.env.PAPEROS_API_TOKEN;
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

PaperOS uses API keys to allow access to the API.

All API requests should include the API token in the Authorization header with the `Bearer` prefix:

`Authorization: Bearer <token>`

You can register a new PaperOS API key at our [developer portal](https://app.paperos.dev).

<aside class="notice">
You must replace <code>ppt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcccc</code> with your personal API key.
</aside>

## Create ID Token

The ID Token represents the subject (user) and can be used to create an organization.

> `POST /api/v1/integrations/id-token`

```shell
curl -v --fail-with-body -X POST "${PAPEROS_BASE_URL}/api/v1/integrations/id-token" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}" \
    -H "Content-Type: application/json" \
    -d '{
            "claims": {
                "external_id": { "value": "john_doe-101" },
                "auth_time": { "value": 1745571774 },
                "exp": { "value": 1745575374 },
                "amr": { "values": ["pwd"] }
            }
        }' | jq
```

```javascript
var payload = JSON.stringify(
   {
      claims: {
         external_id: { value: "john_doe-101" },
         auth_time: { value: 1745571774 },
         exp: { value: 1745575374 },
         amr: { values: ["pwd"] },
      },
   },
   null,
   2
);

var url = `${PAPEROS_BASE_URL}/api/v1/integrations/id-token`;
var basicAuth = btoa(`${oidc.client_id}:${oidc.client_secret}`);
var resp = await fetch(url, {
   method: "POST",
   credentials: "include",
   headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
   },
   body: payload,
});

var accessTokenResult = await resp.json();
console.log(accessTokenResult);
```

> Example Response:

```json
{
   "id_token": "eyJ0eXAiOiJKV1QiLCJraWQiOiJTcG5TVEkyc1p3d0p3aV9oWVJ4VFFnOGlJZHdBMS0zUG81c1NsVUptUXdjIiwiYWxnIjoiRVMyNTYifQ.eyJqdGkiOiJkWXZfZHduTWtIajd3ZjNaM0FQbHZ3IiwiaXNzIjoiaHR0cHM6Ly9wYXBlcm9zLWRldi03LjExMDQuYy5ibm5hLm5ldCIsInN1YiI6InN1Yl9kMDI1NWE4cjNoa25uenNoIiwiYXV0aF90aW1lIjoxNzQ1NDQ3NzQ4LCJjbGllbnRfaWQiOiJvaWRjX3pkY3c5M2s3aDR3NHpiMm0iLCJlbWFpbCI6ImpvaG4uZG9lKzEwMUBleGFtcGxlLmNvbSIsImdpdmVuX25hbWUiOiJKb2huIiwiZmFtaWx5X25hbWUiOiJEb2UiLCJvcmdfaWQiOiJvcmdfZXc0MjFqcjRwbW5oczAyeiIsImlhdCI6MTc0NTQ1MDE0OSwiZXhwIjoxNzQ1NDUzNzQ5fQ.YuvVXJcwfsBJT00SzOHuphh1pt8KXJEMoPmZxKJJWCDrDPbrcI2vX6YNcKtgLOVcv7lKMK1-YKvJBNgAF_N-iA"
}
```

## Create Access Token

The ID Token represents access to a specific organization through the subject (user).

> `POST /api/v1/integrations/access-token`

```shell
curl -v --fail-with-body -X POST "${PAPEROS_BASE_URL}/api/v1/integrations/access-token" \
    --user "${CLIENT_ID}:${CLIENT_SECRET}" \
    -H "Content-Type: application/json" \
    -d '{
            "claims": {
                "external_id": { "value": "john_doe-101" },
                "org_id": { "value": "org_ew421jr4pmnhs02z" },
                "auth_time": { "value": 1745571774 },
                "exp": { "value": 1745575374 },
                "amr": { "values": ["pwd"] }
            }
        }' | jq
```

```javascript
var payload = JSON.stringify(
   {
      claims: {
         external_id: { value: "john_doe-101" },
         org_id: { value: "org_ew421jr4pmnhs02z" },
         auth_time: { value: 1745571774 },
         exp: { value: 1745575374 },
         amr: { values: ["pwd"] },
      },
   },
   null,
   2
);

var url = `${PAPEROS_BASE_URL}/api/v1/integrations/access-token`;
var basicAuth = btoa(`${oidc.client_id}:${oidc.client_secret}`);
var resp = await fetch(url, {
   method: "POST",
   credentials: "include",
   headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
   },
   body: payload,
});

var accessTokenResult = await resp.json();
console.log(accessTokenResult);
```

> Example Response:

```json
{
   "access_token": "eyJ0eXAiOiJKV1QiLCJraWQiOiJTcG5TVEkyc1p3d0p3aV9oWVJ4VFFnOGlJZHdBMS0zUG81c1NsVUptUXdjIiwiYWxnIjoiRVMyNTYifQ.eyJqdGkiOiJkWXZfZHduTWtIajd3ZjNaM0FQbHZ3IiwiaXNzIjoiaHR0cHM6Ly9wYXBlcm9zLWRldi03LjExMDQuYy5ibm5hLm5ldCIsInN1YiI6InN1Yl9kMDI1NWE4cjNoa25uenNoIiwiYXV0aF90aW1lIjoxNzQ1NDQ3NzQ4LCJjbGllbnRfaWQiOiJvaWRjX3pkY3c5M2s3aDR3NHpiMm0iLCJlbWFpbCI6ImpvaG4uZG9lKzEwMUBleGFtcGxlLmNvbSIsImdpdmVuX25hbWUiOiJKb2huIiwiZmFtaWx5X25hbWUiOiJEb2UiLCJvcmdfaWQiOiJvcmdfZXc0MjFqcjRwbW5oczAyeiIsImlhdCI6MTc0NTQ1MDE0OSwiZXhwIjoxNzQ1NDUzNzQ5fQ.YuvVXJcwfsBJT00SzOHuphh1pt8KXJEMoPmZxKJJWCDrDPbrcI2vX6YNcKtgLOVcv7lKMK1-YKvJBNgAF_N-iA"
}
```

## Inspect Token

> `GET /api/user/debug`

```shell
curl --fail-with-body "${PAPEROS_BASE_URL}/api/user/debug" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" |
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
