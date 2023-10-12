---
weight: 1500
title: Ranes Examples
---

# Ranes Examples

An example of what api requests Ranes will be initially using and how they
interact with each other.

**Variables Used**: \
`PAPEROS_BASE_URL: https://ranes.c.paperos.dev/` \
`PAPEROS_API_TOKEN: *ranes api token*` \
`my_org_id: *saved from the "POST /api/v1/orgs" response*`

## Create Organization

Create PaperOS Organization the same time a Ranes Organization is created.

1. Save `id` from response payload to use in later api requests.

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs" \
    -X 'POST' \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "name": "My Test Company 11",
        "inputs": {
            "org:partner_slug": "ranes"
        }
    }' |
    jq
```

```javascript
var data = {
  name: 'My Test Company 11',
  inputs: {
    'org:partner_slug': 'ranes',
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
```

> Example Response:

```json
{
  "id": "org_01hbsvp9tk3qthd2jjz2vzv0g8",
  "name": "My Test Company 11",
  "brand_id": "brand_01h2stkn1fqe8dcfmyrq7thpab",
  "created_at": "2023-10-03T04:10:43.000Z",
  "updated_at": "2023-10-03T04:10:49.000Z"
}
```

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
which you can do with our current api, but we can discuss what route would be
best.

\*\*This would technically be the only PaperOS touch point necessary for a Ranes
Operator at mvp.

## Create Employee Records

Create a Record at the same time a Ranes Employee is added.

1. All you will currently need to pass through the request body will be the name
   and email of the employee, which will be used on our end to populate question
   inputs in the Employee Onboarding Workflow Assessment.
2. The record `id` from this response will be used in the "Open Workflow" api
   request body.

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/records" \
    -X 'POST' \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "name": "Jeff Richards",
        "email": "jeff.richards@ranes.com",
    }'
```

```javascript
var data = {
  "name": "Jeff Richards",
  "email": "jeff.richards@ranes.com",
};
var url = `${paperBase}/api/account/v1/resources/individual?account_id=${my_org_id}`;
var resp = await fetch(url, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
    },
    body: JSON.stringify(data, null, 2);
});
var recordInfo = await resp.json();
var record_id = recordInfo.id;
```

> Example Response:

```json
{
  "success": true,
  "type": "string",
  "rec_id": "rec_01hcey7qcfeeqmh1af6x3xafa2"
}
```

## Open Employee Onboarding Workflow

Open the Employee Onboarding Workflow with some pre-populated data, and set the
assessment to auto complete.

1. setting `auto_complete` to true will have the Workflow assessment
   automatically complete.
2. Before opening this workflow, make sure the Ranes Operator manually completes
   the "Ranes Account Setup Workflow" for the company of that employee.

```shell
template_id='185' # this is the template id telling us to generate a new "Employee Onboarding (Ranes)" Workflow
employee_resource=record_id # this will be the id from the response of the Create Record api request.

curl "${PAPEROS_BASE_URL}/api/account/project_template/${template_id}/create?account_id=${my_org_id}" \
    -X POST \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "resources": {
            "employee": "'"${employee_resource}"'"
        },
        "auto_complete": true
    }' |
    jq
```

```javascript
var templateId = 185; // this is the template id telling us to generate a new "Employee Onboarding (Ranes)" Workflow
var params = { account_id: accountId };
var search = new URLSearchParams(params).toString();

var employeeRecord = record_id; // this will be the id from the response of the Create Record api request.
var data = {
  resources: {
    employee: employeeRecord,
  },
  auto_complete: true,
};

var url = `${paperBase}/api/account/project_template/${templateId}/create?${search}`;
var resp = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${paperToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data, null, 2),
});
var workflowInfo = await resp.json();
```

## Get Documents by Company

Get a list of documents for a specific account

```shell
curl "${PAPEROS_BASE_URL}/api/account/document_history?account_id=${my_org_id}" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```javascript
var url = `${paperBase}/api/account/document_history?account_id=${my_org_id}`;
var resp = await fetch(url, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
  },
});
var companyDocsInfo = await resp.json();

console.log(companyDocsInfo);
```

## Get Documents by Employee Email

Get a list of documents for an employee by company account id & email.

```shell
curl "${PAPEROS_BASE_URL}/api/account/document_history?account_id=${my_org_id}&email=${employee_email}" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```javascript
var url = `${paperBase}/api/account/document_history?account_id=${my_org_id}&email=${employee_email}`;
var resp = await fetch(url, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
  },
});
var employeeDocsInfo = await resp.json();

console.log(employeeDocsInfo);
```
