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
2. A signed-in user loads a page; the SSO gate forwards their PaperOS access
   token to **your backend** in a request header.
3. Your backend calls the Developer API with that token, scoped to one org.
4. Your backend stores what it needs in your own Postgres database.

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

There is **one rule**: send `Authorization: Bearer <token>`, where the token is
any PaperOS user token.

When your app runs behind PaperOS SSO on the deploy platform, the SSO gate
forwards the signed-in user's PaperOS access token to your app backend in the
**`X-Auth-Request-Access-Token`** request header. Read it, and pass it on as the
Bearer token.

<aside class="notice">
If your app was deployed before this header was added, re-enable the SSO gate
(deploy tool <code>set_app_sso_gate</code> with <code>enabled: true</code>) so
it starts forwarding the token.
</aside>

## Org scoping is automatic

For every `/api/v1/orgs/{org_id}/...` route, PaperOS checks that the user can
access that org and scopes the call to it. There is no separate
"workspace token" step.

`{org_id}` accepts the org's public id (`org_xxx`) or its numeric id. Get the
list of orgs the user can access from [`GET /api/v1/orgs`](#orgs).

## Token expiry

Tokens expire after about **1 hour**. The SSO gate refreshes the browser
session roughly every 55 minutes, so:

- read the header **on every request**; don't cache the token
- if PaperOS returns `401 UNAUTHORIZED` (missing, malformed, expired, or
  invalid token), return 401 to your frontend and have
  it reload the page, so the SSO gate refreshes the session, then try again

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

## Optional: org-bound access token

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
   "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ...",
   "token_type": "Bearer",
   "expires_in": 3600,
   "org_id": "org_01ewdxxpvgg2y19pbtbyddtvv8",
   "account_id": 97
}
```

You don't need this for normal use; automatic org scoping covers it. It is
there for clients that want a token bound to a single org. Treat the returned
token exactly like the user token: backend only, never stored.
