---
weight: 1500
title: Ranes Examples
---

# Ranes Examples

An example of what api requests Ranes will be initially using and how they
interact with each other.

Whitelabelled Staging Site: https://ranes.c.paperos.dev/

## Create Organization

Create PaperOS Organization the same time a Ranes Organization is created.

1. Save `account_id` from response payload to use in later api requests.

```shell
curl "${PAPEROS_BASE_URL}/api/user/accounts" \
    -X 'POST' \
    -H 'Authorization: Bearer ${PAPEROS_API_TOKEN}' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "company_name": "*RANES COMPANY NAME*",
        "features": [
            { "feature_type_id": 881, "value": "Ranes" }
        ]
    }'
```

```javascript
var data = {
  "company_name": "*RANES COMPANY NAME*",
  "features": [
    { "feature_type_id": 881, "value": "Ranes" }
  ]
};
var url = `${paperBase}/api/user/accounts`;
var resp = await fetch(url, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
    },
    body: JSON.stringify(data, null, 2);
});
var resource = await resp.json();

console.log(resource);
```

## Create Employee Records

Create a Record at the same time a Ranes Employee is added.

1. All you will currently need to pass through the request body will be the name
   and email of the employee, which will be used on our end to populate question
   inputs in the Employee Onboarding Workflow Assessment.
2. The resource id from this payload will be used in the "Open Workflow" api
   request body.

```shell
curl "$PAPEROS_BASE_URL/api/account/v1/resources/individual?account_id=${account_id}" \
    -X 'POST' \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN"
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
var url = `${paperBase}/api/account/v1/resources/individual?account_id=${account_id}`;
var resp = await fetch(url, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
    },
    body: JSON.stringify(data, null, 2);
});
var resource = await resp.json();

console.log(resource);
```

## Open Employee Onboarding Workflow

Open the Employee Onboarding Workflow with some pre-populated data, and set the
assessment to auto complete.

1. setting `auto_complete` to true will have the Workflow assessment
   automatically complete.
2. Before opening this workflow, make sure the Ranes Operator manually completes
   the "Ranes Account Setup Workflow" for the company of that employee.

```shell
template_id='2' # this is the template id telling us to generate a new "Employee Onboarding (Ranes)" Workflow
employee_resource='*RESOURCE ID*' # this will be the id from the response of the Create Record api request.

curl "${PAPEROS_BASE_URL}/api/account/project_template/${template_id}/create?account_id=${account_id}" \
    -X POST \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "resources": {
            "employee": "${employee_resource}"
        },
        "auto_complete": true
    }' |
    jq
```

```javascript
var templateId = 2; // this is the template id telling us to generate a new "Employee Onboarding (Ranes)" Workflow
var params = { account_id: accountId };
var search = new URLSearchParams(params).toString();

var employeeRecord = "*RESOURCE ID*"; // this will be the id from the response of the Create Record api request.
var data = {
  resources: {
    employee: employeeRecord,
  },
  auto_complete: true,
};

var url = `${paperBase}/api/account/project_template/${templateId}/create?${search}`;
var resp = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${paperToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data, null, 2),
});
var workflow = await resp.json();

console.log(workflow);
```

## Get Documents by Company

Get a list of documents for a specific account

`GET /api/account/document_history?account_id={{account_id}}`

```shell
curl "$PAPEROS_BASE_URL/api/account/document_history?account_id=${account_id}" \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN"
```

```javascript
var url = `${paperBase}/api/account/document_history?account_id=${account_id}`;
var resp = await fetch(url, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
  },
});
var resource = await resp.json();

console.log(resource);
```

> Example Response:

```json
{
  "TODO": "todo"
}
```

## Get Documents by Employee Email

Get a list of documents for an employee by company account id & email.

`GET /api/account/document_history?account_id={{account_id}}&email={{email}}`

```shell
curl "$PAPEROS_BASE_URL/api/account/document_history?account_id=${account_id}&email=${employee_email}" \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN"
```

```javascript
var url = `${paperBase}/api/account/document_history?account_id=${account_id}&email=${employee_email}`;
var resp = await fetch(url, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${PAPEROS_API_TOKEN}`,
  },
});
var resource = await resp.json();

console.log(resource);
```

> Example Response:

```json
{
  "TODO": "todo"
}
```
