---
weight: 1200
title: Records
---

# Records

Records are the collections of data that can be both the result of form submissions, and made available for autofill selection to future forms.

## Create One

> `POST /api/account/v1/resources/individual`

```shell
curl "$PAPEROS_BASE_URL/api/account/v1/resources/individual?account_id=${my_org_id}" \
    -X 'POST' \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "name": "Bob the Builder",
        "title": "master builder",
        "email": "bob@bobbuild.bob",
        "employee_documents_list": "All of the above",
        "upload_or_generate": "Generate"
    }' |
    jq
```

```javascript
var data = {
  name: "Bob the Builder",
  title: "master builder",
  email: "bob@bobbuild.bob",
  employee_documents_list: "All of the above",
  upload_or_generate: "Generate",
};
var payload = JSON.stringify(data, null, 2);

var params = { account_id: orgId };
var search = new URLSearchParams(params).toString();
var url = `${paperBase}/api/account/v1/resources/individual?${search}`;
var resp = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${paperToken}`,
    "Content-Type": "application/json",
  },
  body: payload,
});
var resInfo = await resp.json();
```

> Example Response:

```json
{
  "id": 17413,
  "name": "Bob the Builder",
  "resource_type_id": 1,
  "account_id": 97,
  "created_at": "2023-09-22T19:50:13.000Z",
  "updated_at": "2023-09-22T19:50:13.000Z",
  "finalized": 0,
  "archived": 0,
  "is_draft": 0,
  "features": {
    "name": "Bob the Builder",
    "signatory_name": "Bob the Builder",
    "first_name": "Bob",
    "last_name": "Builder",
    "middle_name": "the",
    "title": "master builder",
    "email": "bob@bobbuild.bob",
    "employee_documents_list": "All of the above",
    "upload_or_generate": "Generate"
  }
}
```

Create a new record belonging to this organization.

TODO: make `resource_type` a parameter, as to not conflict with `/resources/:id`

`POST /api/account/v1/resources/{{resource_type}}?account_id={{org_id}}`

### Record Types

<!--
    SELECT
        CONCAT("`", `slug`, "`") AS Slug,
        CONCAT("`", `code`, "`") AS Code
    FROM `resource_type`
    ORDER BY `slug`;
-->

| Slug             | Code        |
| ---------------- | ----------- |
| `activity`       | `acty`      |
| `annual_report`  | `ann_rpt`   |
| `benefit_plan`   | `benf`      |
| `contract`       | `k`         |
| `counsel`        | `cnsl`      |
| `doc`            | `doc`       |
| `equity`         | `eq`        |
| `equity_class`   | `eq_cl`     |
| `equity_plan`    | `eq_plan`   |
| `ext_entity`     | `ext_enty`  |
| `financials`     | `fins`      |
| `financing`      | `fin`       |
| `individual`     | `indv`      |
| `investment`     | `invt`      |
| `ip`             | `ip`        |
| `legal_audit`    | `lgl_adt`   |
| `npo`            | `npo`       |
| `org`            | `org`       |
| `org_history`    | `org_hx`    |
| `pii`            | `pii`       |
| `qtly_finacials` | `qtly_fins` |
| `questionnaire`  | `qre`       |
| `secretary`      | `secy`      |
| `security`       | `sec`       |
| `state`          | `st`        |
| `task`           | `task`      |
| `tax_filing`     | `tax`       |
| `tos`            | `tos`       |

## List All by Org

> `GET /api/account/v1/resources`

```shell
curl "$PAPEROS_BASE_URL/api/account/v1/resources?account_id=${my_org_id}" \
  -H "Authorization: Bearer $PAPEROS_API_TOKEN" |
  jq
```

```javascript
var params = { account_id: orgId };
var search = new URLSearchParams(params).toString();
var url = `${paperBase}/api/account/v1/resources?${search}`;
var resp = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${paperToken}`,
  },
});
var resInfos = await resp.json();
```

> Example Response:

```json
[
  {
    "id": 5617,
    "name": "Test 1",
    "resource_type_id": 2,
    "account_id": 97,
    "created_at": "2021-01-19T18:18:49.000Z",
    "updated_at": "2021-01-19T18:18:49.000Z",
    "finalized": 0,
    "archived": 0,
    "is_draft": 0,
    "features": {
      "name": "Test 1"
    }
  },
  {
    "id": 17413,
    "name": "Bob the Builder",
    "resource_type_id": 1,
    "account_id": 97,
    "created_at": "2023-09-22T19:50:13.000Z",
    "updated_at": "2023-09-22T19:50:13.000Z",
    "finalized": 0,
    "archived": 0,
    "is_draft": 0,
    "features": {
      "name": "Bob the Builder",
      "signatory_name": "Bob the Builder",
      "first_name": "Bob",
      "last_name": "Builder",
      "middle_name": "the",
      "title": "master builder",
      "email": "bob@bobbuild.bob",
      "employee_documents_list": "All of the above",
      "upload_or_generate": "Generate"
    }
  }
]
```

Records are scoped to a specific account.

TODO don't allow creating completely empty entities

## Get One by ID

> `GET /api/account/v1/resources/:id`

```shell
my_resource_id='17413'

curl "$PAPEROS_BASE_URL/api/account/v1/resources/${my_resource_id}?account_id=${my_org_id}" \
  -H "Authorization: Bearer $PAPEROS_API_TOKEN" |
  jq
```

```javascript
var resourceId = "17413";

var params = { account_id: orgId };
var search = new URLSearchParams(params).toString();
var url = `${paperBase}/api/account/v1/resources/${resourceId}?${search}`;
var resp = await fetch(url, {
  headers: {
    Authorization: `Bearer ${paperToken}`,
  },
});
var resInfo = await resp.json();
```

> Example Response:

```json
{
  "id": 17413,
  "name": "Bob the Builder",
  "resource_type_id": 1,
  "account_id": 97,
  "created_at": "2023-09-22T19:50:13.000Z",
  "updated_at": "2023-09-22T19:50:13.000Z",
  "finalized": 0,
  "archived": 0,
  "is_draft": 0,
  "features": {
    "name": "Bob the Builder",
    "signatory_name": "Bob the Builder",
    "first_name": "Bob",
    "last_name": "Builder",
    "middle_name": "the",
    "title": "master builder",
    "email": "bob@bobbuild.bob",
    "employee_documents_list": "All of the above",
    "upload_or_generate": "Generate"
  }
}
```

Show details for a resource by its ID.

## Update One by ID

> `PATCH /api/account/v1/resources/:id`

```shell
my_resource_id='5617'

curl "$PAPEROS_BASE_URL/api/account/v1/resources/${my_resource_id}?account_id=${my_org_id}" \
    -X 'PATCH' \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN"
    -H 'Content-Type: application/json' \
    --data-raw '{
        "title": "Ultra Master painter",
        "email": "bob@bobrossian.bob",
        "contractor_notes": "Paintings on a field of liquid white.",
        "name": "Bob Painter Ross"
    }' |
    jq
```

```javascript
var resourceId = "5617";

var data = {
  title: "Ultra Master painter",
  email: "bob@bobrossian.bob",
  contractor_notes: "Paintings on a field of liquid white.",
  name: "Bob Painter Ross",
};
var payload = JSON.stringify(data, null, 2);

var params = { account_id: orgId };
var search = new URLSearchParams(params).toString();
var url = `${paperBase}/api/account/v1/resources/${resourceId}?${search}`;
var resp = await fetch(url, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${paperToken}`,
    "Content-Type": "application/json",
  },
  body: payload,
});
var resInfo = await resp.json();
```

> Example Response:

```json
{
  "id": 5617,
  "name": "Bob Painter Ross",
  "resource_type_id": 2,
  "account_id": 97,
  "created_at": "2021-01-19T18:18:49.000Z",
  "updated_at": "2023-09-22T21:23:01.000Z",
  "finalized": 0,
  "archived": 0,
  "is_draft": 0,
  "features": {
    "name": "Bob Painter Ross",
    "email": "bob@bobrossian.bob"
  }
}
```

Update the properties of an existing resource
