---
weight: 1000
title: Quickstart
---

# Introduction

The **PaperOS Developer API** lets your app read and write the data in a PaperOS
organization (a "workspace"): pull reports such as capital statements and
investor lists, batch-upload statements built from bank or accounting exports,
add and update records, and keep your own database in sync.

This quickstart covers the common jobs. The [full API reference](/reference/)
documents everything else (OIDC clients, workflows, and more).

<aside class="notice">
<strong>New:</strong> Reports, Batch Uploads, and the org access-token exchange
are new and live on <strong>staging</strong> (<code>staging.paperos.dev</code>)
first. Build against staging; they will reach production afterwards.
</aside>

## What counts as the Developer API

| Path            | What it is                                                         |
| --------------- | ------------------------------------------------------------------ |
| `/api/v1/*`     | **The Developer API** (this site). Stable, documented, use it.     |
| `/api/public/*` | Unauthenticated app routes used by the PaperOS UI. Not for you.    |
| `/api/*`        | Internal app routes used by the PaperOS UI. Undocumented, changes. |

Only call `/api/v1/*`. If you need something that only exists on an internal
route, ask us to add it to the Developer API.

## How a typical integration looks

1. Your app is deployed on the PaperOS deploy platform, behind PaperOS SSO.
2. A signed-in user loads a page; the SSO gate forwards their **OAuth access
   token** to **your backend** in a request header.
3. Your backend sends that token to a Developer API URL naming the user's
   selected PaperOS workspace. PaperOS checks their access and obtains an
   account-scoped token internally.
4. The API returns the requested data, such as reports. Your backend returns
   only the data your UI needs and, if needed, stores it in your database.

The browser never sees the token, and never calls PaperOS directly.

# Base URLs

> Pick a base URL

```shell
# Staging (prototypes, test data)
export PAPEROS_BASE_URL='https://staging.paperos.dev'

# Production
# export PAPEROS_BASE_URL='https://app.paperos.com'
```

```javascript
// Staging (prototypes, test data):  https://staging.paperos.dev
// Production:                       https://app.paperos.com
var paperBase = process.env.PAPEROS_BASE_URL;
```

| Environment | Base URL                                                    |
| ----------- | ----------------------------------------------------------- |
| Staging     | `https://staging.paperos.dev`                               |
| Production  | `https://app.paperos.com` (or your organization's branded domain) |

Use **staging** while you build. Data on staging is test data. Keep the base
URL in an environment variable so switching to production is a config change,
not a code change.

Some organizations also have a sandbox, at an address like
`https://demo.example.c.paperos.net`. Use one only if PaperOS has given it to you.

# Authentication

> Every request

```text
Authorization: Bearer <token>
```

> In your backend, the token arrives on each request from the SSO gate:

```javascript
// Express
var token = req.get("X-Auth-Request-Access-Token");

var resp = await fetch(`${paperBase}/api/v1/orgs?updated_since=0`, {
   headers: { Authorization: `Bearer ${token}` },
});
```

```shell
# For manual testing from a terminal, export a short-lived token you
# obtained yourself. Never commit it, log it, or paste it into chat.
export PAPEROS_TOKEN='xxxx.yyyy.zzzz'

curl "${PAPEROS_BASE_URL}/api/v1/orgs?updated_since=0" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

When your app runs behind PaperOS SSO on the deploy platform, the SSO gate
forwards the signed-in user's **OAuth access token** to your app backend in the
**`X-Auth-Request-Access-Token`** request header. Read it, and pass it on as the
Bearer token. This identifies the user; it does **not** select a PaperOS workspace.

The gate does not forward the ID token or refresh token to your app. Your backend
does not need to convert the OAuth token into an ID token before using the API.

## Which token is which?

| Token | What it represents | Default lifetime |
| --- | --- | --- |
| OAuth access token | The signed-in user in the OAuth flow. This is what the SSO gate forwards. | 1 hour |
| PaperOS ID token | The user's identity, without choosing an account. Also accepted as a user token by these APIs. | 24 hours |
| PaperOS access token without an account | A user token returned by the internal exchange when no account is selected. It does not grant extra workspace access compared with the ID token. | 1 hour |
| Account-scoped PaperOS access token | A token containing a selected account after membership is checked. | 1 hour |

The response field name `access_token` alone does not tell you which of these
flows issued it. The token without an account still needs account scoping to
operate on workspace data, just like the ID token; the data API can perform that
step internally. None of these tokens grants membership the user does not have.

A refresh token renews the OAuth session. It is not an API bearer token and is
not forwarded to your app. The client-ID/client-secret authentication in the
[full reference](/reference/#authentication) is a separate integration model,
not a prerequisite for using the SSO gate's token.

<aside class="notice">
If your app was deployed before this header was added, re-enable the SSO gate
(deploy tool <code>set_app_sso_gate</code> with <code>enabled: true</code>) so
it starts forwarding the token.
</aside>

<span id="org-scoping-is-automatic"></span>

## Selecting a workspace

Use the original user-level token from the gate and put the selected workspace
in `/api/v1/orgs/{org_id}/...`. PaperOS checks membership and exchanges to an
account-scoped token internally before handling the request. You do not need to
make that exchange yourself. A PaperOS ID token follows the same user-level path.

Use a public org ID (`org_...`) returned by [`GET /api/v1/orgs`](#orgs). Here
**org**, **workspace**, and **account** refer to the PaperOS data context, not a
GitHub organization. `account_id` is its internal numeric ID. Numeric IDs are
accepted by some routes, but not consistently across the API.

### Data requests return data; token requests return tokens

| Request | Response |
| --- | --- |
| `GET /api/v1/orgs/{org_id}/reports` | The workspace's available reports. |
| `GET /api/v1/orgs/{org_id}/reports/{report}` | The requested report's data. |
| `POST /api/v1/orgs/{org_id}/access-token` | An account-scoped access token and metadata, **not** report data or an ID token. |

Putting an org ID in a reports URL does not turn the response into a token.
Token exchange is an internal step on the way to the report data. See the
[current limitations](#current-workspace-scoping-limitations) before reusing an
already account-scoped token.

## Token expiry

The gate's OAuth access token normally expires after **1 hour**. The gate is
configured to attempt session renewal on requests after about 55 minutes; this
is not a guarantee that every browser session renews successfully. So:

- read the header **on every request**; don't cache the token
- if PaperOS returns `401 UNAUTHORIZED` (missing, malformed, expired, or
  invalid token), return 401 to your frontend and send the user back through
  sign-in if session renewal fails; do not retry in an endless reload loop

Because you must not store the token, run syncs while handling a user request
(for example a "Sync now" button, or on page load).

## Security do's and don'ts

**Do**

- call PaperOS only from your **backend**
- read the token from the request header per request
- use staging while building

**Don't**

- send the token to browser JavaScript, put it in cookies you set, or in URLs
- write the token to logs, error trackers, or your database
- store SSNs or EINs (reports mask them by default; leave it that way)

<span id="optional-org-bound-access-token"></span>

## Optional: account-scoped access token

> `POST /api/v1/orgs/{org_id}/access-token`

```shell
curl -X POST "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/access-token" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/access-token`;
var resp = await fetch(url, {
   method: "POST",
   headers: { Authorization: `Bearer ${token}` },
});
var orgToken = await resp.json();
```

> Example Response:

```json
{
   "access_token": "<ACCOUNT_ACCESS_TOKEN>",
   "token_type": "Bearer",
   "expires_in": 3600,
   "org_id": "org_01ewdxxpvgg2y19pbtbyddtvv8",
   "account_id": 97
}
```

The workspace is selected by the URL; no `account_id` body is needed. The
response includes only the account access token and metadata, **not** an
`id_token`. `expires_in` is the remaining lifetime, which can be less than 3600
if the server reuses an existing token.

You don't need this call for normal data requests with the gate's user token.
If you use it, send the resulting token only to URLs for the same workspace.
Keep it backend-only, never logged or stored. Do not treat its account claim as
a guarantee that it cannot be exchanged for another workspace the user can access.

## Current workspace-scoping limitations

Source review of the server's staging revision `f1ede6e07` on October 2, 2026
found these differences between endpoint families. These are documented
limitations, not fixes or a claim of live endpoint testing:

- **Records:** an already account-scoped token can retain its original account
  even when the URL names a different workspace. A request intended for B may
  read or write A. Use the original user-level token from the gate, or a token
  whose account matches the URL.
- **Reports, batches, and the access-token endpoint:** an already scoped token
  may be exchanged for the workspace in the URL if the user has access there.
  An account-scoped token is not an exclusive delegation boundary.
- **Get one org:** this route looks up the public `org_...` ID, unlike newer
  routes that also accept numeric account IDs. Use public IDs from List Orgs.

These differences do not remove the membership requirement. Do not rely on
cross-workspace token reuse behaving the same way across all endpoints.
