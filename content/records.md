---
weight: 1400
title: Records
---

# Records

Records are the individual things in an org: investors (individuals and
entities), investments, the org itself, and so on. Reports are views over
records, so each report row is a record.

Record URLs take the public record id, `rec_...`: the `record_id` of a report
row, or the `rec_id` returned when you create a record. (A report row's numeric
`id` is not accepted here.)

Use records to **add or update one thing at a time**. For many rows at once,
use [Batch Uploads](#batch-uploads).

## Record Types and Fields

These are introspection endpoints: use them to discover type and field names
while you build, but don't depend on the exact response shape at runtime, as it
may change.

> `GET /api/v1/schema`

```shell
curl -s "${PAPEROS_BASE_URL}/api/v1/schema" |
    jq -r '.record_types[].type'
```

```javascript
var resp = await fetch(`${paperBase}/api/v1/schema`);
var { record_types } = await resp.json();
```

> `GET /api/v1/schema/{type}`

```shell
curl -s "${PAPEROS_BASE_URL}/api/v1/schema/individual" |
    jq -r '.field_types[].type'
```

```javascript
var resp = await fetch(`${paperBase}/api/v1/schema/individual`);
var { field_types } = await resp.json();
```

Lists record types, and the fields each type has. Use these to find the
`type` and `fields` keys for creating and updating records.

## List Records

> `GET /api/v1/orgs/{org_id}/records?type={type_slug}`

```shell
curl -G "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/records" \
    --data-urlencode "type=individual" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var params = new URLSearchParams({ type: "individual" });
var url = `${paperBase}/api/v1/orgs/${orgId}/records?${params}`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var records = await resp.json();
```

> Example Response:

```json
[
   {
      "id": 17413,
      "name": "Jane Doe",
      "resource_type_id": 1,
      "account_id": 97,
      "created_at": "2023-09-22T19:50:13.000Z",
      "updated_at": "2023-09-22T19:50:13.000Z",
      "finalized": 0,
      "archived": 0,
      "is_draft": 0,
      "features": {
         "name": "Jane Doe",
         "email": "jane@example.com"
      }
   }
]
```

| Parameter | Description                                               |
| --------- | --------------------------------------------------------- |
| `type`    | record type slug, such as `individual` (`*` for all types) |
| `rec_ids` | comma-separated record ids (`rec_...`)                    |

## Get One Record

> `GET /api/v1/orgs/{org_id}/records/{rec_id}`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/records/${rec_id}" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/records/${recId}`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var record = await resp.json();
```

Returns one record, in the same shape as the list items above. `{rec_id}` is
the public `rec_...` id.

## Create a Record

> `POST /api/v1/orgs/{org_id}/records`

```shell
curl -X POST "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/records" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" \
    -H "Content-Type: application/json" \
    --data-raw '{
        "type": "individual",
        "name": "Jane Doe",
        "fields": {
            "email": "jane@example.com"
        }
    }' |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/records`;
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
   },
   body: JSON.stringify({
      type: "individual",
      name: "Jane Doe",
      fields: { email: "jane@example.com" },
   }),
});
var { rec_id } = await resp.json();
```

> Example Response:

```json
{
   "success": true,
   "rec_id": "rec_01hcey7qcfeeqmh1af6x3xafa2"
}
```

**Store the returned `rec_id` in your database immediately**, so a retry
doesn't create a second record.

## Update a Record

> `PATCH /api/v1/orgs/{org_id}/records/{rec_id}`

```shell
curl -X PATCH "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/records/${rec_id}" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" \
    -H "Content-Type: application/json" \
    --data-raw '{
        "fields": {
            "email": "jane.doe@example.com"
        }
    }' |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/records/${recId}`;
var resp = await fetch(url, {
   method: "PATCH",
   headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
   },
   body: JSON.stringify({
      fields: { email: "jane.doe@example.com" },
   }),
});
var result = await resp.json();
```

> Example Response:

```json
{
   "success": true,
   "changes": ["email"]
}
```

Body: `{ "name": "...", "fields": { "<field>": "<value>" } }`. `name` is
optional; send only the fields you're changing.

There is **no conflict check**: the last write wins, and `updated_at` is set by
the server. If someone (or another system) may edit the record in PaperOS,
re-read it right before patching so you don't overwrite their change with stale
data.
