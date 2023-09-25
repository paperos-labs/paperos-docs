---
weight: 1400
title: Documents
---

# Documents

A combination of documents waiting to be signed, completed, or uploaded.

## Get Documents by Org

Get a list of documents for a specific account

`GET /api/account/document_history?account_id={{account_id}}`

```shell
curl "$PAPEROS_BASE_URL/api/account/document_history?account_id=${account_id}" \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN"
```

```javascript
var url = `${paperBase}/api/account/document_history?account_id=${account_id}`;
var resp = await fetch(url, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
  },
});
var resource = await resp.json();

console.log(resource);
```

> Example Response:

```json
{
  "TODO": "todo"
}
```

## Get Documents by Email

Get a list of documents for a specific account & email

`GET /api/account/document_history?account_id={{account_id}}&email={{email}}`

```shell
curl "$PAPEROS_BASE_URL/api/account/document_history?account_id=${account_id}&email=${email}" \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN"
```

```javascript
var url = `${paperBase}/api/account/document_history?account_id=${account_id}&email=${email}`;
var resp = await fetch(url, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
  },
});
var resource = await resp.json();

console.log(resource);
```

> Example Response:

```json
{
  "TODO": "todo"
}
```
