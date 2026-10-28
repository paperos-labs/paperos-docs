---
weight: 1500
title: Documents
---

# Documents

Documents in an org: uploaded files, generated documents (such as capital
statement PDFs from a batch upload), and documents waiting for signatures.

## List Documents

> `GET /api/v1/orgs/{org_id}/documents`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/documents" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/documents`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var { documents } = await resp.json();
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
         "path": "/Investors/Capital Statements",
         "filename": "Q3 Capital Statement - Jane Doe.pdf",
         "recipients": [],
         "url": "https://staging.paperos.dev/api/public/documents/820701358552/eyJ0eXAiOiJKV1Qi...",
         "pub_id": "doc_0000000000p6a290bsjjqmkfk1"
      }
   ]
}
```

| Parameter | Description                                          |
| --------- | ---------------------------------------------------- |
| `email`   | only documents for this person, e.g. `?email=jane@example.com` |

- `url` is a **temporary** download link. Don't store it; store `pub_id` and
  list again when you need a fresh link.
- If a document needs signatures, the signers are in `recipients[]`.
