---
weight: 1400
title: Documents
---

# Documents

A combination of documents waiting to be signed, completed, or uploaded.

## Get Documents by Org

> `GET /api/v1/orgs/{{org_id}}/documents`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents" \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```javascript
var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents`;
var resp = await fetch(url, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
    },
});

var orgDocumentsInfo = await resp.json();

console.log('orgDocumentsInfo', orgDocumentsInfo);
```

```json
{
    "success": true,
    "total": 3,
    "count": 3,
    "type": "[]<document>",
    "documents": [
        {
            "path": "/Finances/Historical Financials",
            "filename": "2017 - 2020 Balance Sheet.xlsx",
            "recipients": [],
            "url": "https://paperos.com/api/public/documents/820701358552/eyJ0eXAiOiJKV1QiLCJraWQiOiJKa3BxUW1faW9IeHRsb1BOTS12VE1IenkzR0xWLW1GbEhDdkxPMVJ0RlhVIiwiYWxnIjoiRVMyNTYifQ.eyJmaWxlIjoiODIwNzAxMzU4NTUyIiwiaWF0IjoxNjk3MjI3NTA0LCJleHAiOjE2OTcyMjg0MDQsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSJ9.iNPasWw1VfMDuNTTDHW16f5CgmXgKJUoyY9I6Ac2RPosGn61GSMDMgPXzi10uSk2Mg9SjtWclZxdIe5t6z-Lqw",
            "pub_id": "doc_0000000000p6a290bsjjqmkfk1"
        },
        {
            "path": "/Team/Offer Letters",
            "filename": "NewCo, Inc.--Offer Letter",
            "recipients": [
                {
                    "email": "sam+henryk@savvi.legal",
                    "signature_link": "*url link to pandadoc to sign document*",
                    "signed": 1
                },
                {
                    "email": "sam+test@savvi.legal",
                    "signature_link": "*url link to pandadoc to sign document*",
                    "signed": 0
                }
            ],
            "url": "",
            "pub_id": "doc_01ga7bz7qrags0e02zawdjr0b6"
        }
    ]
}
```

Get a list of documents for a specific account

## Get Documents by Email

Get a list of documents for a specific account & email

> `GET /api/v1/orgs/{{org_id}}/documents?email={{email}}`

```shell
curl -G "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents" \
    --data-urlencode "email=henryk@gmail.com" \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```javascript
var params = { email: 'henryk@gmail.com' };
var search = new URLSearchParams(params).toString();
var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents?${search}`;
var resp = await fetch(url, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
    },
});
var employeeDocsInfo = await resp.json();
```

> Example Response:

```json
{
    "success": true,
    "total": 1,
    "count": 1,
    "type": "[]<document>",
    "documents": [
        {
            "path": "/Team/Offer Letters",
            "filename": "NewCo, Inc.--Offer Letter",
            "recipients": [
                {
                    "email": "henryk@gmail.com",
                    "signature_link": "*url link to pandadoc to sign document*",
                    "signed": 1
                }
            ],
            "url": "",
            "pub_id": "doc_01ga7bz7qrags0e02zawdjr0b6"
        }
    ]
}
```
