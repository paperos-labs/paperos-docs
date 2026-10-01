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
         "slug": "capital_statement_report",
         "name": "Capital Statement Report",
         "record_count": 42
      },
      {
         "id": 1235,
         "slug": "investor_list",
         "name": "Investor List",
         "record_count": 18
      }
   ]
}
```

Lists the reports available in the org, with how many records each has.
Which reports exist depends on the org. Slugs you will commonly see include
`capital_statement_report`, `capital_contribution_report`,
`distribution_report`, `investor_list`, `k1_report`, `lp_company_summary`,
`spv_equity`, and `spv_financings`. Use the slugs this endpoint returns rather
than hard-coding a list.

## Get Report Data

> `GET /api/v1/orgs/{org_id}/reports/{report}`

```shell
curl -G "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/reports/capital_statement_report" \
    --data-urlencode "offset=0" \
    --data-urlencode "limit=500" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var report = encodeURIComponent("capital_statement_report");
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
      "slug": "capital_statement_report",
      "name": "Capital Statement Report"
   },
   "columns": [
      { "key": "Name", "type": "string" },
      { "key": "Email", "type": "string" },
      { "key": "Ownership Percentage", "type": "string" },
      { "key": "Total Contributions", "type": "string" },
      { "key": "Inception To Date Distributions", "type": "string" },
      { "key": "Inception To Date Ending Balance", "type": "string" },
      { "key": "Capital Statement Document", "type": "string" }
   ],
   "record_count": 42,
   "offset": 0,
   "returned": 42,
   "masked_columns": [],
   "records": [
      {
         "id": 98765,
         "record_id": "rec_01hcey7qcfeeqmh1af6x3xafa2",
         "fields": {
            "Name": "Jane Doe",
            "Email": "jane@example.com",
            "Ownership Percentage": "12.5",
            "Total Contributions": "250000",
            "Inception To Date Distributions": "0",
            "Inception To Date Ending Balance": "250000",
            "Capital Statement Document": "File Uploaded"
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
| `format`           | JSON    | `csv` downloads the report as CSV (columns: `record_id`, `id`, then the report's) |

Things to know:

- **Field keys are the report's display labels**, exactly as shown in the
  PaperOS table: `"Name"`, `"Email"`, `"Total Contributions"`, not
  `name`/`total_contributions`. `columns[].key` is that same label. Labels
  differ between reports (`investor_list` uses `"Full Legal Name"`,
  `"Email Address"`, `"Commitment Amount"`, `"SSN/EIN"`, `"Signatory Name"`;
  `distribution_report` uses `"Name"`, `"Amount"`, `"Distribution Date"`,
  `"Email"`). Map the labels you need to your own column names explicitly, and
  tolerate a missing key: labels can be renamed in PaperOS.
- **Values are strings**, exactly as stored (`"250000"`, not `250000`). Parse
  numbers and dates yourself.
- Document columns show `"File Uploaded"`, not the file. Use
  [Documents](#documents) for files.
- Each record has two ids. **`record_id`** (`rec_...`) is the public record
  id: use it with the [Records](#records) endpoints and as the key when syncing
  to your database. `id` is PaperOS's internal numeric id; it is stable, but the
  Records endpoints don't accept it.
- For large reports, page with `offset`/`limit` until you've read
  `record_count` records.
- `masked_columns` lists columns whose values were masked. Avoid
  `reveal_sensitive=true` unless you truly need the full value, and never store
  it.

## Download as CSV

> `GET /api/v1/orgs/{org_id}/reports/{report}?format=csv`

```shell
curl -G "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/reports/capital_statement_report" \
    --data-urlencode "format=csv" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" \
    -o capital_statement_report.csv
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/reports/capital_statement_report?format=csv`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var csvText = await resp.text();
```

Same data as the JSON form, as a CSV file. The columns are `record_id`, `id`,
then the report's columns.
