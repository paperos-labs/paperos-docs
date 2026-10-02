---
weight: 1700
title: End-to-End Example
---

# End-to-End Example

A small Node.js (18+) + Express backend that:

1. reads the user-level OAuth access token the SSO gate forwards
2. lists reports and syncs one into Postgres (with `pg`)
3. builds a CSV from your own data, dry-runs it, and uploads it once

The code is in the **JavaScript** tab on the right. It uses the tables from
[Suggested Tables](#suggested-tables).

## Setup and Helper

> `server.js`: setup and a PaperOS helper

```javascript
// npm install express pg
import crypto from "node:crypto";
import express from "express";
import pg from "pg";

const PAPEROS_BASE_URL = process.env.PAPEROS_BASE_URL; // https://staging.paperos.dev
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(express.json({ limit: "5mb" }));

// Report fields are keyed by display label ("Name", "Total Contributions", ...).
// Map the labels you use to your own names in one place; labels can be renamed
// in PaperOS, so a missing label becomes null instead of an error.
const CAPITAL_STATEMENT_FIELDS = {
   name: "Name",
   email: "Email",
   ownership_pct: "Ownership Percentage",
   total_contributions: "Total Contributions",
   itd_distributions: "Inception To Date Distributions",
   itd_ending_balance: "Inception To Date Ending Balance",
};

function pickFields(fields, mapping) {
   const out = {};
   for (const [col, label] of Object.entries(mapping)) {
      out[col] = fields?.[label] ?? null;
   }
   return out;
}

// Call the Developer API as the signed-in user.
// The token is read per request and never stored or logged.
async function paperos(req, path, init = {}) {
   const token = req.get("X-Auth-Request-Access-Token");
   if (!token) {
      throw Object.assign(new Error("not signed in"), { status: 401 });
   }
   const resp = await fetch(`${PAPEROS_BASE_URL}${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
      // Batch uploads generate PDFs before returning (~7s for one row, longer
      // for bigger batches), so allow several minutes.
      signal: init.signal ?? AbortSignal.timeout(10 * 60 * 1000),
   });
   const type = resp.headers.get("content-type") || "";
   const body = type.includes("json") ? await resp.json() : await resp.text();
   if (!resp.ok) {
      throw Object.assign(new Error(body?.message || `PaperOS ${resp.status}`), {
         status: resp.status,
         code: body?.code,
         body,
      });
   }
   return body;
}
```

`paperos()` reads the `X-Auth-Request-Access-Token` header on every request,
calls PaperOS from the backend with a generous timeout, and turns error
responses into exceptions that carry `status` and `code`. `pickFields()` turns
a report record's label-keyed `fields` into your own column names.

## Pull a Report Into Postgres

> List reports, then sync one

```javascript
// GET /api/orgs/:orgId/reports -> the org's reports (for a picker in your UI)
app.get("/api/orgs/:orgId/reports", async (req, res, next) => {
   try {
      const orgId = encodeURIComponent(req.params.orgId);
      const { reports } = await paperos(req, `/api/v1/orgs/${orgId}/reports`);
      res.json(reports);
   } catch (err) {
      next(err);
   }
});

// POST /api/orgs/:orgId/sync/:report -> full pull of one report
app.post("/api/orgs/:orgId/sync/:report", async (req, res, next) => {
   const { orgId, report } = req.params;
   const startedAt = new Date();
   const pageSize = 5000;
   try {
      // 1. fetch every page
      const records = [];
      let reportSlug;
      for (let offset = 0; ; offset += pageSize) {
         const page = await paperos(
            req,
            `/api/v1/orgs/${encodeURIComponent(orgId)}/reports/` +
               `${encodeURIComponent(report)}?offset=${offset}&limit=${pageSize}`,
         );
         reportSlug = page.report.slug;
         records.push(...page.records);
         if (page.returned < pageSize || records.length >= page.record_count) {
            break;
         }
      }

      // 2. upsert in one transaction, 3. soft-delete what disappeared
      const db = await pool.connect();
      try {
         await db.query("BEGIN");
         for (const rec of records) {
            await db.query(
               `INSERT INTO paperos_records
                   (org_id, paperos_record_id, report_slug, fields, last_synced_at)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (org_id, paperos_record_id) DO UPDATE
                   SET fields = EXCLUDED.fields,
                       report_slug = EXCLUDED.report_slug,
                       last_synced_at = EXCLUDED.last_synced_at,
                       removed_upstream_at = NULL`,
               [orgId, rec.record_id, reportSlug, rec.fields, startedAt],
            );
         }
         await db.query(
            `UPDATE paperos_records
                SET removed_upstream_at = now()
              WHERE org_id = $1 AND report_slug = $2
                AND last_synced_at < $3 AND removed_upstream_at IS NULL`,
            [orgId, reportSlug, startedAt],
         );
         await db.query("COMMIT");
      } catch (err) {
         await db.query("ROLLBACK");
         throw err;
      } finally {
         db.release();
      }

      res.json({ report: reportSlug, synced: records.length });
   } catch (err) {
      next(err);
   }
});

// GET /api/orgs/:orgId/capital-statements -> synced rows in your own shape
app.get("/api/orgs/:orgId/capital-statements", async (req, res, next) => {
   try {
      const { rows } = await pool.query(
         `SELECT paperos_record_id, fields FROM paperos_records
           WHERE org_id = $1 AND report_slug = 'capital_statement_report'
             AND removed_upstream_at IS NULL`,
         [req.params.orgId],
      );
      res.json(
         rows.map((r) => ({
            paperos_record_id: r.paperos_record_id,
            ...pickFields(r.fields, CAPITAL_STATEMENT_FIELDS),
         })),
      );
   } catch (err) {
      next(err);
   }
});
```

Use the same `org_id` form (public `org_xxx` id) everywhere you store it, so
the unique key matches across syncs.

## Build a CSV, Dry Run, Upload

> Upload capital statements built from your own data

```javascript
function toCsv(headers, rows) {
   const cell = (v) => {
      const s = v == null ? "" : String(v);
      return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
   };
   return [headers, ...rows.map((r) => headers.map((h) => r[h]))]
      .map((line) => line.map(cell).join(","))
      .join("\r\n");
}

// POST /api/orgs/:orgId/statements
// body: { file_name, rows: [{ "Investor.name": "...", "Investor.email": "...", ... }] }
// Each row's keys are template headers; map your bank/accounting data to them first.
// Use each investor's "Full Legal Name" / "Email Address" from investor_list exactly,
// or the upload creates a duplicate investor. Investor.send_email_yes_or_no = "Yes"
// emails investors their statements: keep it "No" while testing.
app.post("/api/orgs/:orgId/statements", async (req, res, next) => {
   const { orgId } = req.params;
   const type = "capital_statements";
   const base = `/api/v1/orgs/${encodeURIComponent(orgId)}`;
   let uploadId;
   let posted = false;
   try {
      // 1. template -> CSV with exactly those headers
      const template = await paperos(req, `${base}/batch-types/${type}/template`);
      const headers = template.columns.map((c) => c.header);
      const csv = toCsv(headers, req.body.rows);
      const fileName = req.body.file_name || "statements.csv";
      const hash = crypto.createHash("sha256").update(csv).digest("hex");

      // 2. ledger row; the unique key blocks re-sending the same CSV
      const ins = await pool.query(
         `INSERT INTO batch_uploads (org_id, batch_type, file_name, csv_sha256)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (org_id, batch_type, csv_sha256) DO NOTHING
          RETURNING id`,
         [orgId, type, fileName, hash],
      );
      if (!ins.rowCount) {
         return res.status(409).json({ error: "This exact CSV was already uploaded." });
      }
      uploadId = ins.rows[0].id;

      const payload = () => ({
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ type, file_name: fileName, csv }),
      });

      // 3. dry run: validates, writes nothing
      //    (MISSING_COLUMNS, BLANK_REQUIRED_VALUES etc. throw here)
      const check = await paperos(req, `${base}/batches?dry_run=true`, payload());
      await pool.query(
         `UPDATE batch_uploads SET row_count = $2, status = 'submitted',
                 updated_at = now() WHERE id = $1`,
         [uploadId, check.rows],
      );

      // 4. upload ONCE (not idempotent: never retry automatically)
      posted = true;
      const batch = await paperos(req, `${base}/batches`, payload());
      await pool.query(
         `UPDATE batch_uploads
             SET status = 'succeeded', file_id = $2, batch_url = $3,
                 response = $4, updated_at = now()
           WHERE id = $1`,
         [uploadId, batch.file_id, batch.batch_url,
          { failed_lines: batch.failed_lines, warnings: batch.warnings }],
      );

      // 5. then re-pull the affected report (see the sync route above)
      res.status(201).json(batch);
   } catch (err) {
      if (uploadId && !posted) {
         // Failed before the real upload: nothing was sent, free the ledger slot.
         await pool.query("DELETE FROM batch_uploads WHERE id = $1", [uploadId]);
      } else if (uploadId) {
         // A 4xx means PaperOS rejected it. Anything else (5xx, timeout, network)
         // means we don't know whether it landed: check the report before resending.
         const status = err.status >= 400 && err.status < 500 ? "failed" : "unknown";
         await pool.query(
            `UPDATE batch_uploads SET status = $2, response = $3, updated_at = now()
              WHERE id = $1`,
            [uploadId, status, JSON.stringify(err.body ?? { message: err.message })],
         );
      }
      next(err);
   }
});
```

## Error Handling

> Pass PaperOS errors through safely

```javascript
app.use((err, req, res, next) => {
   // Log the code and message only; never log request headers (they hold the token).
   console.error("request failed:", err.status, err.code, err.message);
   if (err.status === 401) {
      // Return through SSO; sign in again if renewal fails. Do not loop on reload.
      return res.status(401).json({ code: "UNAUTHORIZED" });
   }
   res.status(err.status || 500).json({
      code: err.code || "INTERNAL",
      message: err.message,
      ...(err.body?.missing && { missing: err.body.missing }),
      ...(err.body?.blanks && { blanks: err.body.blanks }),
   });
});

app.listen(process.env.PORT || 8000);
```

On the frontend, call your own `/api/...` routes with `fetch`. On `401`, return
through the SSO gate and ask the user to sign in again if session renewal fails.
Avoid automatic reload loops. The browser never talks to PaperOS directly.
