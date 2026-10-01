---
weight: 1600
title: Syncing With Your Own Database
---

# Syncing With Your Own Database

Your app keeps its own Postgres database. These patterns keep it consistent
with PaperOS without duplicates or lost edits.

## Ground Rules

- **PaperOS is the source of truth** for investor and fund records. Your
  database is a copy plus your app's own data.
- Key every synced row by **`(org_id, paperos_record_id)`**, with a unique
  index, where `paperos_record_id` is the public `rec_...` id (a report row's
  `record_id`, or the `rec_id` returned on create). Store it as text. Don't key
  on the numeric `id`; the Records endpoints don't accept it.
- **Never store** tokens, SSNs, or EINs. Reports mask SSNs/EINs by default;
  don't pass `reveal_sensitive=true` in a sync.
- Build against **staging** (`staging.paperos.dev`); data there is test data.

## Suggested Tables

> Postgres

```sql
-- One row per PaperOS record you've pulled from a report.
CREATE TABLE paperos_records (
    id                  BIGSERIAL PRIMARY KEY,
    org_id              TEXT        NOT NULL,  -- e.g. org_01ewdx...
    paperos_record_id   TEXT        NOT NULL,  -- records[].record_id (rec_...)
    report_slug         TEXT        NOT NULL,  -- e.g. capital_statements
    fields              JSONB       NOT NULL,  -- records[].fields, as strings
    last_synced_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    removed_upstream_at TIMESTAMPTZ,           -- set when missing from a full pull
    UNIQUE (org_id, paperos_record_id)
);

-- One row per batch upload attempt; prevents double submission.
CREATE TABLE batch_uploads (
    id           BIGSERIAL PRIMARY KEY,
    org_id       TEXT        NOT NULL,
    batch_type   TEXT        NOT NULL,          -- e.g. capital_statements
    file_name    TEXT        NOT NULL,
    csv_sha256   TEXT        NOT NULL,          -- hash of the exact CSV sent
    row_count    INTEGER,
    status       TEXT        NOT NULL DEFAULT 'pending',
                 -- pending | submitted | succeeded | failed | unknown
    file_id      TEXT,                          -- from the 201 response
    batch_url    TEXT,                          -- from the 201 response
    response     JSONB,                         -- failed_lines, warnings, error
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (org_id, batch_type, csv_sha256)
);
```

These are starting points; add your own columns (for example, typed copies of
the fields you query often).

## Pulling (PaperOS to your DB)

1. Fetch the report (page with `offset`/`limit` until you have
   `record_count` records).
2. In **one transaction**, upsert each record by `(org_id, paperos_record_id)`
   and set `last_synced_at` to the time the sync started.
3. After a **full** pull, rows for that org and report that weren't touched
   were removed upstream: set `removed_upstream_at` (soft delete). Don't hard
   delete them.

See the [end-to-end example](#end-to-end-example) for the code.

## Pushing (your DB to PaperOS)

**Single records:** `POST` to create, then store the returned `rec_id`
immediately. `PATCH` to update, sending only changed fields. PATCH is last
write wins, so re-read the record first if it may have been edited elsewhere.

**Statements and other bulk data:** use a batch upload.

1. Build the CSV from the [template](#get-a-template) headers.
2. Hash the CSV and insert a `batch_uploads` row (`pending`). If the unique
   constraint fails, this exact CSV was already sent; stop.
3. [Dry run](#dry-run). Fix any `MISSING_COLUMNS` before going on.
4. `POST` it **once**. Save `file_id`, `batch_url`, `failed_lines`, and
   `warnings`, and mark the row `succeeded`.
5. If the POST errored or timed out, mark the row `unknown` and **don't
   retry**. Check the report or `batch_url` to see whether it landed.
6. After success, re-pull the affected report so your DB has the new records.
