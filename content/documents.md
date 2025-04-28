---
weight: 1400
title: Documents
---

# Documents

A combination of documents waiting to be signed, completed, or uploaded.

## Get Documents by Org

Get a list of documents for a specific account

`GET /api/v1/orgs/{{org_id}}/documents`
`GET /api/v1/org/documents?account_id={{account_id}}`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents" \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```shell
curl "$PAPEROS_BASE_URL/api/v1/org/documents?account_id=${account_id}" \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```javascript
var url = `${paperBase}/api/v1/orgs/${my_org_id}/documents`;
var resp = await fetch(url, {
   method: "GET",
   headers: {
      Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
   },
});
```

```javascript
var url = `${paperBase}/api/v1/org/documents?account_id=${account_id}`;
var resp = await fetch(url, {
   method: "GET",
   headers: {
      Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
   },
});
var resource = await resp.json();

console.log(resource);
```

## Get Documents by Email

Get a list of documents for a specific account & email

`GET /api/v1/orgs/{{org_id}}/documents?email={{email}}`
`GET /api/v1/org/documents?account_id={{account_id}}&email={{email}}`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents?email=${email}" \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```shell
curl "${PAPEROS_BASE_URL}/api/v1/org/documents?account_id=${account_id}&email=${email}" \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```javascript
var url = `${paperBase}/api/v1/orgs/${my_org_id}/documents?email=${email}`;
var resp = await fetch(url, {
   method: "GET",
   headers: {
      Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
   },
});
```

```javascript
var url = `${paperBase}/api/v1/org/documents?account_id=${account_id}&email=${email}`;
var resp = await fetch(url, {
   method: "GET",
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
   "success": true,
   "total": 3,
   "count": 3,
   "type": "[]<document>",
   "documents": [
      {
         "path": "/Archived Documentation/Historical Financials",
         "filename": "2017 - 2020 Balance Sheet.xlsx",
         "recipients": [],
         "url": "https://paperos.com/api/public/documents/820701358552/eyJ0eXAiOiJKV1QiLCJraWQiOiJKa3BxUW1faW9IeHRsb1BOTS12VE1IenkzR0xWLW1GbEhDdkxPMVJ0RlhVIiwiYWxnIjoiRVMyNTYifQ.eyJmaWxlIjoiODIwNzAxMzU4NTUyIiwiaWF0IjoxNjk3MjI3NTA0LCJleHAiOjE2OTcyMjg0MDQsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSJ9.iNPasWw1VfMDuNTTDHW16f5CgmXgKJUoyY9I6Ac2RPosGn61GSMDMgPXzi10uSk2Mg9SjtWclZxdIe5t6z-Lqw",
         "pub_id": "doc_0000000000p6a290bsjjqmkfk1"
      },
      {
         "path": "/Archived Documentation/Historical Financials",
         "filename": "2017 - 2020 PnL.xlsx",
         "recipients": [],
         "url": "https://paperos.com/api/public/documents/820688814651/eyJ0eXAiOiJKV1QiLCJraWQiOiJKa3BxUW1faW9IeHRsb1BOTS12VE1IenkzR0xWLW1GbEhDdkxPMVJ0RlhVIiwiYWxnIjoiRVMyNTYifQ.eyJmaWxlIjoiODIwNjg4ODE0NjUxIiwiaWF0IjoxNjk3MjI3NTA0LCJleHAiOjE2OTcyMjg0MDQsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSJ9.WMcM5HULwVyVmiDMMVtibStMou6C_O3Z2886VNZko7U7dBvOrqgPMcYaX0Ilt10q_iM_aj7LF29pNfTgxuXLxQ",
         "pub_id": "doc_00000000000b4j5gfbg8hb0sp6"
      },
      {
         "path": "/Archived Documentation/Historical Financials",
         "filename": "2017 - 2020 Statement of Cash Flows.xlsx",
         "recipients": [],
         "url": "https://paperos.com/api/public/documents/820700190254/eyJ0eXAiOiJKV1QiLCJraWQiOiJKa3BxUW1faW9IeHRsb1BOTS12VE1IenkzR0xWLW1GbEhDdkxPMVJ0RlhVIiwiYWxnIjoiRVMyNTYifQ.eyJmaWxlIjoiODIwNzAwMTkwMjU0IiwiaWF0IjoxNjk3MjI3NTA0LCJleHAiOjE2OTcyMjg0MDQsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSJ9.HXaecHH5bq1QAw5TRQCqnb1dn8dE7spcQpLU1DM6J8AJYraTRqeOcLjRziA9P83YbFgMCzHKY-cDDiGsGoUVlw",
         "pub_id": "doc_0000000000y62e1skpa27jywhv"
      }
   ]
}
```
