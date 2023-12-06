---
weight: 1200
title: Records
---

# Records

Records are the collections of data that can be the result of form submissions
or manual creation. Record data will be saved and made available for autofill
selection in future forms.

## Create One

> `POST /api/v1/orgs/:org_id`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/records" \
    -X 'POST' \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
      "type": "individual",
      "name": "Stanley Yelnats",
      "fields": {
        "title": "hole digger",
        "email": "john@john.doe",
        "employee_documents_list": "All of the above",
        "upload_or_generate": "Generate"
      }
    }' |
    jq
```

```javascript
var data = {
    type: 'individual',
    name: 'Stanley Yelnats',
    fields: {
        title: 'hole digger',
        email: 'john@john.doe',
        employee_documents_list: 'All of the above',
        upload_or_generate: 'Generate',
    },
};

var url = `${paperBase}/api/v1/orgs/${my_org_id}/records`;
var resp = await fetch(url, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${paperToken}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data, null, 2),
});
var recordInfo = await resp.json();
```

> Example Response:

```json
{
    "success": true,
    "type": "string",
    "rec_id": "rec_01hcey7qcfeeqmh1af6x3xafa2"
}
```

Create a new record belonging to this organization.

### Record Types

| Record Type Slug | Record Type Slug (cont.) |
| ---------------- | ------------------------ |
| `activity`       | `ip`                     |
| `annual_report`  | `legal_audit`            |
| `benefit_plan`   | `npo`                    |
| `contract`       | `org`                    |
| `counsel`        | `org_history`            |
| `doc`            | `pii`                    |
| `equity`         | `qtly_finacials`         |
| `equity_class`   | `questionnaire`          |
| `equity_plan`    | `secretary`              |
| `ext_entity`     | `security`               |
| `financials`     | `state`                  |
| `financing`      | `task`                   |
| `individual`     | `tax_filing`             |
| `investment`     | `tos`                    |

<!--
    SELECT
        CONCAT("`", `slug`, "`") AS Slug,
        CONCAT("`", `code`, "`") AS Code
    FROM `resource_type`
    ORDER BY `slug`;
-->

<!-- | Record Type Slug |
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
| `tos`            | `tos`       | -->

## List Records in Org

> `GET /api/v1/orgs/:org_id/records?type={type_slug}`

```shell
curl -G "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/records" \
  --data-urlencode "type=*" \
  -H "Authorization: Bearer $PAPEROS_API_TOKEN" |
  jq
```

```javascript
var params = { type: '*' };
var search = new URLSearchParams(params).toString();
var url = `${paperBase}/api/v1/orgs/:org_id/records?${search}`;
var resp = await fetch(url, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${paperToken}`,
    },
});
var resInfos = await resp.json();
```

> Example Response:

```json
{
    "success": true,
    "count": 2,
    "total": 2,
    "type": "[]<record>",
    "records": [
        {
            "id": "rec_01he905k1b5n26dde4ekvcv22n",
            "type": "org",
            "name": "My For Profit Test Co",
            "fields": {
                "business_type": "for_profit"
            },
            "created_at": "2023-11-02T21:48:58.000Z",
            "updated_at": "2023-11-02T21:48:58.000Z"
        },
        {
            "id": "rec_01he9550cqm37gybnpv1yfvdpp",
            "type": "individual",
            "name": "Stanley Yelnats",
            "fields": {
                "title": "hole digger",
                "email": "john@john.doe",
                "employee_documents_list": "All of the above",
                "upload_or_generate": "Generate"
            },
            "created_at": "2023-11-02T23:16:02.000Z",
            "updated_at": "2023-11-02T23:16:02.000Z"
        }
    ]
}
```

Records are scoped to a specific organization.

<!-- TODO don't allow creating completely empty entities -->

### Query Params

| Parameter | Required | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `type`    | true     | pass either a record type or just '\*' to get back all |

<!-- | `limit`   | false    | return only `n` records                                 |
| `rec_id`  | false    | a single record id (begins with `rec_`)                 |
| `rec_ids` | false    | a comma-separated list of record ids                    |
| `since`   | false    | ISO timestamp of the last time this response was called | -->

## Get One by ID

> `GET /api/v1/orgs/:org_id/records/:rec_id`

```shell
my_rec_id='rec_01he9550cqm37gybnpv1yfvdpp'

curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/records/${my_rec_id}" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" |
  jq
```

```javascript
var myRecId = 'rec_01he9550cqm37gybnpv1yfvdpp';

var url = `${paperBase}/api/v1/orgs/${my_org_id}/records/${myRecId}`;
var resp = await fetch(url, {
    headers: {
        Authorization: `Bearer ${paperToken}`,
    },
});
var recordInfo = await resp.json();
```

> Example Response:

```json
{
    "success": true,
    "type": "individual",
    "record": {
        "id": "rec_01he9550cqm37gybnpv1yfvdpp",
        "type": "individual",
        "name": "Stanley Yelnats",
        "fields": {
            "email": "stanley@yelnats.com"
        },
        "created_at": "2023-11-02T23:16:02.000Z",
        "updated_at": "2023-11-02T23:16:02.000Z"
    }
}
```

Show details for a resource by its ID.

## Update One by ID

> `PATCH /api/v1/orgs/:org_id/records/:rec_id`

```shell
my_rec_id='rec_01he9550cqm37gybnpv1yfvdpp'

curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/records/${my_rec_id}" \
    -X 'PATCH' \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
      "fields": {
        "title": "Product Manager",
        "email": "john2@john.doe",
      }
    }' |
    jq
```

```javascript
var myRecId = 'rec_01he9550cqm37gybnpv1yfvdpp';

var data = {
    fields: {
        title: 'Product Manager',
        email: 'john2@john.doe',
    },
};
var payload = JSON.stringify(data, null, 2);

var params = { account_id: orgId };
var search = new URLSearchParams(params).toString();
var url = `${paperBase}/api/v1/orgs/${my_org_id}/records/${myRecId}`;
var resp = await fetch(url, {
    method: 'PATCH',
    headers: {
        Authorization: `Bearer ${paperToken}`,
        'Content-Type': 'application/json',
    },
    body: payload,
});
var resInfo = await resp.json();
```

> Example Response:

```json
{
    "success": true,
    "type": "[]<string>",
    "total": 3,
    "changes": ["title", "email", "updated_at"],
    "count": 3
}
```

Update the properties of an existing resource
