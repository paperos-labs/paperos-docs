---
weight: 1500
title: Ranes Examples
---

# Ranes Examples

An example of what api requests Ranes will be initially using and how they
interact with each other.

**Variables Used in Examples**: \
`PAPEROS_BASE_URL: https://ranes.c.paperos.dev` \
`PAPEROS_API_TOKEN: *ranes api token*` \
`my_org_id: *saved from "POST /api/v1/orgs" response*` \
`record_id: *saved from "POST /api/v1/orgs/:org_id/records" response*` \

## Create Organization

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs" \
    -X 'POST' \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "name": "Ranes Test Company 3",
        "fields": {
            "partner_slug": "ranes"
        }
    }' |
    jq
```

```javascript
var data = {
    name: 'Ranes Test Company 3',
    fields: {
        partner_slug: 'ranes',
    },
};
var url = `${paperBase}/api/v1/orgs`;

var resp = await fetch(url, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${paperToken}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data, null, 2),
});
var orgInfo = await resp.json();
var my_org_id = orgInfo.id;
```

> Example Response:

```json
{
    "id": "org_01hbsvp9tk3qthd2jjz2vzv0g8",
    "name": "Ranes Test Company 3",
    "brand_id": "brand_01h2stkn1fqe8dcfmyrq7thpab",
    "created_at": "2023-10-03T04:10:43.000Z",
    "updated_at": "2023-10-03T04:10:49.000Z"
}
```

Create PaperOS Organization the same time a Ranes Organization is created.

1. Save `id` value from the response payload to Ranes' DB to be used in any api
   request around this organization. used in later examples under the variable
   `my_org_id`.

## Onboard Org on PaperOS

Before doing the next steps\* a Ranes Operator\*\* will need to:

1. Go to https://ranes.c.paperos.dev and login.
2. Select the Organization just created.
3. Complete the **Ranes Account Setup** Workflow, which can be accessed in the
   **Home** Tab through the **Setup Your Account** To-do, or in the **Workflow
   Library** tab.

\*The **Employee Onboarding** Workflow relies on some data being auto-filled
based off the **Ranes Account Setup** Workflow, & will not generate the
documents correctly if started before this step is complete. It might make sense
to disable the option to create employees until that workflow is completed,
which you can check with our current api, but we can discuss what route would be
best.

\*\*This is technically the only PaperOS touch point necessary for a Ranes
Operator at mvp.

## Create Employee Records

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/records" \
    -X 'POST' \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "type": "individual",
        "name": "Jeff Richards",
        "fields": {
          "email": "jeff.richards@ranes.com",
          "employee_type": "Office Employee (Exempt)"
        }
    }'
```

```javascript
var data = {
    type: 'individual',
    name: 'Jeff Richards',
    fields: {
        email: 'jeff.richards@ranes.com',
        employee_type: 'Office Employee (Exempt)',
}
};

var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/records`;
var resp = await fetch(url, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
    },
    body: JSON.stringify(data, null, 2);
});

var recordInfo = await resp.json();
var record_id = recordInfo.rec_id;
```

> Example Response:

```json
{
    "success": true,
    "type": "string",
    "rec_id": "rec_01hcey7qcfeeqmh1af6x3xafa2"
}
```

Create a Record at the same time a Ranes Employee is added.

| Request Body           | Required Values (Case Sensitive)          |
| ---------------------- | ----------------------------------------- |
| `type`                 | `"individual"`                            |
| `name`                 | `*name of employee*`                      |
| `fields.email`         | `*email of employee*`                     |
| `fields.employee_type` | `<OneOf>` Available Options:              |
|                        | `"Office Employee (Exempt)"`              |
|                        | `"Office Employee (Non-Exempt)"`          |
|                        | `"Full-Time Field Employee (Exempt)"`     |
|                        | `"Full-Time Field Employee (Non-Exempt)"` |
|                        | `"Part-Time Employee"`                    |

-   Use the `rec_id` value from the response payload in the "Open Workflow"
    request params, which will be called right after.

## Open Employee Onboarding Workflow

```shell
template_id='185' # this is the static template id telling us to generate a new "Employee Onboarding (Ranes)" Workflow

curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows/${template_id}" \
    -X POST \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "records": {
            "employee": "'"${record_id}"'"
        },
        "auto_complete": true
    }' |
    jq
```

```javascript
var templateId = 185; // this is the static template id telling us to generate a new "Employee Onboarding (Ranes)" Workflow
var data = {
    records: {
        employee: record_id,
    },
    auto_complete: true,
};

var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows/${templateId}`;
var resp = await fetch(url, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data, null, 2),
});
var workflowInfo = await resp.json();
```

> Example Response:

```json
{
    "status": "success",
    "workflow_id": "wrk_01hcn8arzxb9heq3saaf97b7bx"
}
```

Open the Employee Onboarding Workflow with some pre-populated data, and set the
assessment to auto complete.

1. setting `auto_complete` to true will have the Workflow assessment
   automatically complete.
2. Before opening this workflow, make sure the Ranes Operator manually completes
   the "Ranes Account Setup Workflow" for the company of that employee.

## Get Documents by Company

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents" \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```javascript
var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents`;
var resp = await fetch(url, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
    },
});

var orgDocumentsInfo = await resp.json();
```

Get a list of documents for a specific account

-   recipient signature links will always assume whoever is coming from that url
    is that recipient, so make sure not to expose all recipients' links on a
    document to an employee.

## Get Documents by Employee Email

<!-- curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents?email=${employee_email}" \ -->

```shell
curl -G "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents" \
    --data-urlencode "email=${employee_email}" \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```javascript
var params = { email: employee_email };
var search = new URLSearchParams(params).toString();
var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/documents?${search}`;
var resp = await fetch(url, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
    },
});
var employeeDocsInfo = await resp.json();
```

> Example Response:

```json
{
    "success": true,
    "total": 3,
    "count": 3,
    "type": "[]<document>",
    "documents": [
        {
            "path": "/Team",
            "filename": "NewCo Inc.--Offer Letter (Daniel Andelin).pdf",
            "recipients": [],
            "url": "https://ranes.c.paperos.dev/api/public/documents/951806910727/eyJ0eXAiOiJKV1QiLCJraWQiOiJTcG5TVEkyc1p3d0p3aV9oWVJ4VFFnOGlJZHdBMS0zUG81c1NsVUptUXdjIiwiYWxnIjoiRVMyNTYifQ.eyJmaWxlIjoiOTUxODA2OTEwNzI3IiwiaWF0IjoxNjk3ODM5ODUwLCJleHAiOjE2OTc4NDA3NTAsImlzcyI6Imh0dHBzOi8vc3RhZ2luZy5zYXZ2aS5sZWdhbCJ9.vyRncFtXBSXrvNvhseytsBulfKKKoGYQYN2NiXkAv1jocvRDlzz5Basv-kyPDOAxTIlGFhko7VftLGMsUihd6A",
            "pub_id": "doc_01g1v7xpzrkyhs82vm7fwf9p59"
        },
        {
            "path": "/Team/Offer Letters",
            "filename": "NewCo, Inc.--Offer Letter",
            "recipients": [
                {
                    "email": "sam+henryk@savvi.legal",
                    "signature_link": "*url link to pandadoc to sign document*",
                    "signed": 1
                },
                {
                    "email": "sam+test@savvi.legal",
                    "signature_link": "*url link to pandadoc to sign document*",
                    "signed": 0
                }
            ],
            "url": "",
            "pub_id": "doc_01ga7bz7qrags0e02zawdjr0b6"
        },
        {
            "path": "Team/Non-Compete Agreements",
            "filename": "NewCo, Inc.--Non-Competition Agreement (Henryk Tillamook)",
            "recipients": [
                {
                    "email": "sam+henryk@savvi.legal",
                    "signature_link": "*url link to pandadoc to sign document*",
                    "signed": 0
                },
                {
                    "email": "sam+test@savvi.legal",
                    "signature_link": "*url link to pandadoc to sign document*",
                    "signed": 0
                }
            ],
            "url": "",
            "pub_id": "doc_01ga7c1zm8e3js90v2nqjpv68x"
        }
    ]
}
```

Get a list of documents for an employee by company account id & email.

-   Response will only have this email recipient of the document, even if the
    document has multiple recipients.
