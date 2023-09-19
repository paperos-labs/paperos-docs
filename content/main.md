---
weight: 10
title: API Reference
---

# Introduction

Welcome to the PaperOS API! You can use our API to access Kittn API endpoints, which can get information on various cats, kittens, and breeds in our database.

You can view code examples in the dark area to the right, and you can switch the programming language of the examples with the tabs in the top right.

**This example API documentation page was created with [DocuAPI](https://github.com/bep/docuapi/), a multilingual documentation theme for the static site generator [Hugo Extended Edition](http://webinstall.dev/hugo-extended/).**

## API Base URL

```text
https://app.paperos.com
https://example.c.paperos.com
https://paperos.example.com
```

Depending on your account, your PaperOS base URL may resemble any of the following:

-   https://app.paperos.com
-   https://example.c.paperos.com
-   https://paperos.example.com

For general operations you can always use `https://app.paperos.com`, however, using the branded domain may be required for certain actions, such as those that generate branded notifications.

# Authentication

> To authorize, use this code:

```text
my_token='ppt_2A3u0U9d8xlBOo3CYFRT5vmkuH76bP0yfNVw48IBM5'
```

```shell
my_baseurl='https://example.c.paperos.dev'

curl "${my_baseurl}/api/user/debug" \
  -H "Authorization: Bearer ${my_token}"
```

```javascript
let my_baseurl = "https://example.c.paperos.dev";

let resp = await fetch(`${my_baseurl}/api/user/debug`, {
    headers: {
        Authorization: `Bearer ${my_token}`,
    },
});
let data = await resp.json();
```

> Make sure to replace `ppt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcccc` with your API key.

PaperOS uses API keys to allow access to the API.

All API requests should include the API token in the Authorization header with the `Bearer` prefix:

`Authorization: Bearer <token>`

You can register a new PaperOS API key at our [developer portal](https://app.paperos.dev).

<aside class="notice">
You must replace <code>ppt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcccc</code> with your personal API key.
</aside>
