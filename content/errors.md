---
weight: 2000
title: Errors
---

# Errors

> Error shape

```json
{
   "status": 400,
   "code": "MISSING_COLUMNS",
   "message": "The CSV is missing required columns for this batch type.",
   "missing": ["Investor.email"]
}
```

Errors return a non-2xx status and a JSON body with `status`, a stable `code`,
a human-readable `message`, and sometimes extra fields. Branch on `code`, not
on `message`.

| Status | `code`                  | Meaning and what to do                                                                |
| ------ | ----------------------- | ------------------------------------------------------------------------------------- |
| 400    | `MISSING_COLUMNS`       | CSV lacks required columns; see `missing`. Fix the header row.                        |
| 400    | `BLANK_REQUIRED_VALUES` | A required column is empty in some rows; see `blanks` (`line`, `column`; up to 50). Fill them in. Dry run catches it. |
| 400    | `UNKNOWN_BATCH_TYPE`    | Not a valid batch type; see `batch_types`.                                            |
| 400    | `EMPTY_CSV`             | The CSV has no data rows.                                                             |
| 400    | `INVALID_CSV`           | The CSV couldn't be parsed (check quoting and line endings).                          |
| 401    | `UNAUTHORIZED`          | Token missing, malformed, expired, or invalid. Have the browser reload so the SSO gate refreshes it. |
| 404    | `ORG_NOT_FOUND`         | The org doesn't exist or this user can't access it.                                   |
| 404    | `REPORT_NOT_FOUND`      | No such report; see `available` for report names.                                     |
| 409    | `BATCH_PROJECT_MISSING` | The org isn't set up for this batch type yet. Contact PaperOS.                        |
| 413    | `CSV_TOO_LARGE`         | Over 5 MB. Split into several files.                                                  |
| 502    | `UPSTREAM_ERROR`        | A service PaperOS depends on failed. Safe to retry a `GET`; for a batch `POST`, check first. |

Other statuses you may see: `403` (no access), `405` (wrong method), `429`
(slow down), `500` (our bug; please tell us), `502` (the app may be
restarting).

<aside class="warning">
Retrying is safe for <code>GET</code> requests. Never automatically retry a
batch upload <code>POST</code>; it is not idempotent.
</aside>
