---
weight: 1100
title: Orgs
---

# Orgs

An org (organization, "workspace") is a company, fund, or other entity in
PaperOS. Everything else (reports, batches, records, documents) lives inside an
org, so start here to find the `org_id` you'll use in every other call.

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

Returns a single org. `{org_id}` may be the public id (`org_xxx`) or the
numeric id. Returns `404 ORG_NOT_FOUND` if the user can't access it.
