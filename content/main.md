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
curl https://webi.sh/jq | sh
curl https://webi.sh/node | sh

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

# Authentication

> Use your own API Token, or this example token:

```sh
export PAPEROS_API_TOKEN='ppt_2A3u0U9d8xlBOo3CYFRT5vmkuH76bP0yfNVw48IBM5'
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
            placeholder="ppt_2A3u0U9d8xlBOo3CYFRT5vmkuH76bP0yfNVw48IBM5"
            value="ppt_2A3u0U9d8xlBOo3CYFRT5vmkuH76bP0yfNVw48IBM5"
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

## Inspect Token

> `GET /api/user/debug`

```shell
curl "${PAPEROS_BASE_URL}/api/user/debug" \
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
