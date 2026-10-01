---
weight: 1200
title: Reports
---

# Reports

Reports are the tables you see in PaperOS: capital statements, investors,
commitments, and so on. Each row is a PaperOS record. This is the easiest way
to pull data out of an org.

<aside class="notice">New: live on staging first.</aside>

## List Reports

> `GET /api/v1/orgs/{org_id}/reports`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/reports" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/reports`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var { reports } = await resp.json();
```

> Example Response:

```json
{
   "org_id": "org_01ewdxxpvgg2y19pbtbyddtvv8",
   "reports": [
      {
         "id": 1234,
         "slug": "capital_statements",
         "name": "Capital Statements",
         "record_count": 42
      }
   ]
}
```

Lists the reports available in the org, with how many records each has.

## Get Report Data

> `GET /api/v1/orgs/{org_id}/reports/{report}`

```shell
curl -G "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/reports/capital_statements" \
    --data-urlencode "offset=0" \
    --data-urlencode "limit=500" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var report = encodeURIComponent("capital_statements");
var params = new URLSearchParams({ offset: 0, limit: 500 });
var url = `${paperBase}/api/v1/orgs/${orgId}/reports/${report}?${params}`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var data = await resp.json();
```

> Example Response:

```json
{
   "org_id": "org_01ewdxxpvgg2y19pbtbyddtvv8",
   "report": {
      "id": 1234,
      "slug": "capital_statements",
      "name": "Capital Statements"
   },
   "columns": [
      { "key": "investor_name", "type": "string" },
      { "key": "total_commitment", "type": "string" }
   ],
   "record_count": 42,
   "offset": 0,
   "returned": 42,
   "masked_columns": [],
   "records": [
      {
         "id": 98765,
         "fields": {
            "investor_name": "Jane Doe",
            "total_commitment": "250000"
         }
      }
   ]
}
```

`{report}` can be the report's `id`, `slug`, or `name` (case-insensitive;
URL-encode names with spaces). An unknown report returns
`404 REPORT_NOT_FOUND`, with the names that do exist in `available`.

| Parameter          | Default | Description                                                          |
| ------------------ | ------- | -------------------------------------------------------------------- |
| `offset`           | `0`     | skip this many records                                               |
| `limit`            | all     | return at most this many records (max `5000`)                        |
| `reveal_sensitive` | `false` | `true` returns SSNs/EINs unmasked (default: masked to last 4)         |
| `format`           | JSON    | `csv` downloads the report as CSV, with a leading `record_id` column |

Things to know:

- **Values are strings**, exactly as stored (`"250000"`, not `250000`). Parse
  numbers and dates yourself.
- Document columns show `"File Uploaded"`, not the file. Use
  [Documents](#documents) for files.
- `records[].id` is the PaperOS record id. Use it with the
  [Records](#records) endpoints, and as the key when syncing to your database.
- For large reports, page with `offset`/`limit` until you've read
  `record_count` records.
- `masked_columns` lists columns whose values were masked. Avoid
  `reveal_sensitive=true` unless you truly need the full value, and never store
  it.

## Download as CSV

> `GET /api/v1/orgs/{org_id}/reports/{report}?format=csv`

```shell
curl -G "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/reports/capital_statements" \
    --data-urlencode "format=csv" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" \
    -o capital_statements.csv
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/reports/capital_statements?format=csv`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var csvText = await resp.text();
```

Same data as the JSON form, as a CSV file whose first column is `record_id`.
