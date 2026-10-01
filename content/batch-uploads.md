---
weight: 1300
title: Batch Uploads
---

# Batch Uploads

Batch uploads let you send many rows at once as a CSV: capital statements built
from your accounting data, bank transactions from a bank statement export, and
so on. PaperOS creates the records (and, for capital statements and
distribution notices, generates the PDF documents server-side).

<aside class="notice">New: live on staging first.</aside>

The flow is always the same:

1. get the **template** for the batch type
2. build a CSV with exactly those headers
3. **dry run** it (validates, writes nothing)
4. **upload** it once

| Type                    | Use it for                                         |
| ----------------------- | -------------------------------------------------- |
| `capital_statements`    | investor capital statements (PDFs are generated)   |
| `distribution_notices`  | distribution notices (PDFs are generated)          |
| `capital_contributions` | capital contributions received                     |
| `portfolio_investments` | the fund's portfolio investments                   |
| `bank_transactions`     | lines from a bank statement export                 |
| `send_capital_calls`    | capital calls to send to investors                 |

## List Batch Types

> `GET /api/v1/orgs/{org_id}/batch-types`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/batch-types" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/batch-types`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var { batch_types } = await resp.json();
```

> Example Response:

```json
{
   "batch_types": [
      {
         "type": "capital_statements",
         "name": "Capital Statements",
         "template_url": "/api/v1/orgs/org_01ewdxxpvgg2y19pbtbyddtvv8/batch-types/capital_statements/template"
      }
   ]
}
```

The authoritative list of types for this org.

## Get a Template

> `GET /api/v1/orgs/{org_id}/batch-types/{type}/template`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/batch-types/capital_statements/template" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/batch-types/capital_statements/template`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${token}` },
});
var template = await resp.json();
var headers = template.columns.map((c) => c.header);
```

> Example Response:

```json
{
   "type": "capital_statements",
   "columns": [
      { "header": "investor.email", "required": true }
   ]
}
```

Returns the CSV columns for a batch type. Headers look like
`resource_var.field_name` (for example `investor.email`).

Build your CSV header row from the `header` values, in order. Add
`?format=csv` to download a header-only CSV instead (handy as a spreadsheet
starting point; required columns are marked with `*` there).

| Parameter | Default | Description                         |
| --------- | ------- | ----------------------------------- |
| `format`  | JSON    | `csv` returns the header-only CSV   |

## Dry Run

> `POST /api/v1/orgs/{org_id}/batches?dry_run=true`

```shell
curl -X POST "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/batches?dry_run=true&type=capital_statements&file_name=q3-statements.csv" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" \
    -H "Content-Type: text/csv" \
    --data-binary @q3-statements.csv |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/batches?dry_run=true`;
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
   },
   body: JSON.stringify({
      type: "capital_statements",
      file_name: "q3-statements.csv",
      csv: csvText,
   }),
});
var check = await resp.json();
```

> Example Response (200):

```json
{
   "dry_run": true,
   "type": "capital_statements",
   "rows": 12,
   "columns": ["investor.email"],
   "missing": []
}
```

> Example Error (400):

```json
{
   "status": 400,
   "code": "MISSING_COLUMNS",
   "message": "missing required columns",
   "missing": ["investor.email"]
}
```

Validates without writing anything: checks the type, that the CSV parses, that
required columns are present, and counts rows. **Always dry run first.**

## Upload a Batch

> `POST /api/v1/orgs/{org_id}/batches`

```shell
curl -X POST "${PAPEROS_BASE_URL}/api/v1/orgs/${org_id}/batches?type=capital_statements&file_name=q3-statements.csv" \
    -H "Authorization: Bearer ${PAPEROS_TOKEN}" \
    -H "Content-Type: text/csv" \
    --data-binary @q3-statements.csv |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${orgId}/batches`;
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
   },
   body: JSON.stringify({
      type: "capital_statements",
      file_name: "q3-statements.csv",
      csv: csvText,
   }),
});
var batch = await resp.json();
```

> Example Response (201):

```json
{
   "org_id": "org_01ewdxxpvgg2y19pbtbyddtvv8",
   "type": "capital_statements",
   "file_name": "q3-statements.csv",
   "file_id": "1234567890",
   "rows": 12,
   "batch_url": "https://staging.paperos.dev/portal",
   "failed_lines": [],
   "warnings": []
}
```

Send the CSV either way:

- **raw CSV**: `Content-Type: text/csv`, with `?type=...&file_name=...` in the
  query string
- **JSON**: `{ "type", "csv": "<raw csv text>", "file_name" }`

| Parameter   | Default | Description                                          |
| ----------- | ------- | ---------------------------------------------------- |
| `type`      |         | batch type (query string, raw CSV form only)         |
| `file_name` |         | name to record for the file (raw CSV form only)      |
| `dry_run`   | `false` | `true` validates only; nothing is written            |

Limits and checks: max **5 MB**; unknown type, empty CSV, or missing required
columns return `400`. Check `failed_lines` and `warnings` in the response, and
open `batch_url` to see the batch in PaperOS.

<aside class="warning">
<strong>Uploads are NOT idempotent.</strong> Posting the same CSV twice creates
duplicate rows and duplicate documents. Never automatically retry a
<code>POST /batches</code> that failed or timed out. Check the report (or
<code>batch_url</code>) first to see whether it landed, and keep an upload
ledger in your database (see <a href="#syncing-with-your-own-database">Syncing</a>).
</aside>
