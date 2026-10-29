---
weight: 1300
title: Forms
---

# Forms

Form uploads let you submit data to PaperOS as a CSV: capital statements built
from your accounting data, bank transactions from a bank statement export, and
so on. Each row in the CSV is one form, so you can submit a single form or many
forms in the same request. PaperOS creates the records (and, for capital
statements and distribution notices, generates the PDF documents server-side).

<aside class="notice">New: live on staging first.</aside>

The flow is always the same:

1. get the **template** for the form
2. build a CSV with exactly those headers, one row per form
3. **dry run** it (validates, writes nothing)
4. **submit** it once

<aside class="warning">
<strong>Capital statement submissions can email investors.</strong> The
<code>capital_statements</code> template requires an
<code>Investor.send_email_yes_or_no</code> column. <code>Yes</code> emails each
investor their generated statement as part of the submission. Use <code>No</code>
for testing and prototypes; only send <code>Yes</code> when you actually intend
to notify those investors.
</aside>

| Type                    | Use it for                                       |
| ----------------------- | ------------------------------------------------ |
| `capital_statements`    | investor capital statements (PDFs are generated) |
| `distribution_notices`  | distribution notices (PDFs are generated)        |
| `capital_contributions` | capital contributions received                   |
| `portfolio_investments` | the fund's portfolio investments                 |
| `bank_transactions`     | lines from a bank statement export               |
| `send_capital_calls`    | capital calls to send to investors               |

## List Forms

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

The authoritative list of forms available for this org. Each form's `type` is
what you pass to the template and submission endpoints.

## Get Form Template

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
      { "header": "Capital Statement.name", "required": true },
      { "header": "Capital Statement.period_ending_date", "required": true },
      { "header": "Investor.name", "required": true },
      { "header": "Investor.email", "required": true },
      { "header": "Investor.send_email_yes_or_no", "required": true }
   ]
}
```

Returns the CSV columns for a form. Headers are the resource label, a
dot, and the field (for example `Capital Statement.period_ending_date`,
`Investor.name`, `Investor.email`). The example above is abridged; always build
from the template the endpoint returns.

**Matching investors:** rows are matched to existing investors by **name and
email**. Send the investor's name and email exactly as they appear in the
`investor_list` report (`"Full Legal Name"` and `"Email Address"`). A name that
doesn't match (or is blank) creates a new, duplicate investor instead of
attaching the row to the existing one.

Build your CSV header row from the `header` values, in order. Add
`?format=csv` to download a header-only CSV instead (handy as a spreadsheet
starting point; required columns are marked with `*` there).

| Parameter | Default | Description                       |
| --------- | ------- | --------------------------------- |
| `format`  | JSON    | `csv` returns the header-only CSV |

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
   "columns": [
      "Capital Statement.name",
      "Capital Statement.period_ending_date",
      "Investor.name",
      "Investor.email",
      "Investor.send_email_yes_or_no"
   ],
   "missing": []
}
```

> Example Error (400):

```json
{
   "status": 400,
   "code": "MISSING_COLUMNS",
   "message": "The CSV is missing required columns for this batch type.",
   "missing": ["Investor.email"],
   "template_url": "/api/v1/orgs/org_01ewdxxpvgg2y19pbtbyddtvv8/batch-types/capital_statements/template"
}
```

> Example Error (400), a required value left empty:

```json
{
   "status": 400,
   "code": "BLANK_REQUIRED_VALUES",
   "message": "Some rows leave required columns empty. Fill them in or drop those rows.",
   "blanks": [{ "line": 2, "column": "Investor.name" }]
}
```

Validates without writing anything: checks the type, that the CSV parses, that
required columns are present, that no row leaves a required column empty, and
counts rows. **Always dry run first.**

`BLANK_REQUIRED_VALUES` means a required column is in the header but empty in
one or more rows. `blanks` lists each `line` (CSV line number, header is line 1)
and `column`, up to 50 entries. Fill them in and dry run again. (Left
unchecked, a blank `Investor.name` would create a nameless duplicate investor.)

## Form(s) Submission

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
var submission = await resp.json();
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

Submits one or more forms of the same type. The CSV is the header row from the
[template](#get-form-template) followed by one row per form:

- **one form**: a header row plus a single data row (for example, one
  investor's capital statement)
- **many forms**: a header row plus as many data rows as you need (for example,
  every investor's capital statement for the quarter)

> One form:

```csv
Capital Statement.name,Capital Statement.period_ending_date,Investor.name,Investor.email,Investor.send_email_yes_or_no
Q3 2026 Statement,2026-09-30,Jane Doe,jane@example.com,No
```

> Many forms:

```csv
Capital Statement.name,Capital Statement.period_ending_date,Investor.name,Investor.email,Investor.send_email_yes_or_no
Q3 2026 Statement,2026-09-30,Jane Doe,jane@example.com,No
Q3 2026 Statement,2026-09-30,John Smith,john@example.com,No
Q3 2026 Statement,2026-09-30,Acme Holdings LLC,ops@acme.example,No
```

`rows` in the response is the number of forms submitted. To submit different
form types, send one request per type.

Send the CSV either way:

- **raw CSV**: `Content-Type: text/csv`, with `?type=...&file_name=...` in the
  query string
- **JSON**: `{ "type", "csv": "<raw csv text>", "file_name" }`

| Parameter   | Default | Description                                     |
| ----------- | ------- | ----------------------------------------------- |
| `type`      |         | form type (query string, raw CSV form only)     |
| `file_name` |         | name to record for the file (raw CSV form only) |
| `dry_run`   | `false` | `true` validates only; nothing is written       |

Limits and checks: max **5 MB**; unknown type, empty CSV, missing required
columns (`MISSING_COLUMNS`), or blank required values (`BLANK_REQUIRED_VALUES`)
return `400`, the same checks as the dry run. Check `failed_lines` and `warnings` in the response, and
open `batch_url` to see the submission in PaperOS.

**Submissions are slow; set a long timeout.** The request returns only after
PaperOS has created the records and generated the PDFs. On staging a one-row
capital statement submission took about 7 seconds; more forms take
proportionally longer. Give the `POST` a client timeout of several minutes
(for example 10), and make sure any proxy in front of your backend allows it.

<aside class="warning">
<strong>Submissions are NOT idempotent.</strong> Posting the same CSV twice creates
duplicate rows and duplicate documents. Never automatically retry a
<code>POST /batches</code> that failed or timed out. Check the report (or
<code>batch_url</code>) first to see whether it landed, and keep a submission
ledger in your database (see <a href="#syncing-with-your-own-database">Syncing</a>).
</aside>
