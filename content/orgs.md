---
weight: 1100
title: Orgs
---

# Orgs

An org (organization, "workspace") is a company, fund, or other entity in
PaperOS. Everything else (reports, batches, records, documents) lives inside an
org, so start here to find the `org_id` you'll use in every other call.

This is not a GitHub organization. The API's public `org_...` ID and its internal
numeric `account_id` identify the same PaperOS workspace. Prefer the public ID
returned below because numeric IDs are not accepted by every endpoint.

## List Orgs

> `GET /api/v1/orgs?updated_since=0`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs?updated_since=0" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs?updated_since=0`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var { orgs } = await resp.json();
```

> Example Response:

```json
{
   "updated_at": 1677000469,
   "orgs": [
      {
         "id": "org_01ewdxxpvgg2y19pbtbyddtvv8",
         "name": "Example Fund I, LP",
         "brand_id": "brand_00000000000000000000000000",
         "created_at": "2021-01-19T18:18:46.000Z",
         "updated_at": "2023-02-21T17:27:49.000Z"
      }
   ]
}
```

Lists the orgs the signed-in user can access.

| Parameter       | Default | Description                                              |
| --------------- | ------- | -------------------------------------------------------- |
| `updated_since` |         | required; pass `0`, or the `updated_at` from a prior call |

## Get One Org

> `GET /api/v1/orgs/{org_id}`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var org = await resp.json();
```

Returns a single org. Use the public ID (`org_...`); this route does not resolve
numeric account IDs. An inaccessible or unknown org returns 404. This older
route can return `NOT_FOUND`, while newer org routes use `ORG_NOT_FOUND`.
