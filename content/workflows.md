---
weight: 1300
title: Workflows
---

# Workflows

The Workflow Library shows each of the available form collections for a
particular task.

## Open a Workflow

> `POST /api/v1/orgs/:org_id/workflow/:workflow_template_id`

```shell
my_template_id='2'

curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows/${my_template_id}" \
    -X POST \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' |
    jq
```

```javascript
var templateId = 2;

var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows/${my_template_id}`;
var resp = await fetch(url, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${paperToken}`,
    },
});
var workflowInfo = await resp.json();

console.log(workflowInfo);
```

> Example Response:

```json
{
    "status": "success",
    "workflow_id": "wrk_01hcn8arzxb9heq3saaf97b7bx"
}
```

Opening a workflow will create the associated To-Do items in the PaperOS
interface.

## Open with Prepopulated Data

> `POST /api/v1/orgs/${org_id}/workflows/${template_id}`

```shell
my_template_id='2'
my_employee_record='rec_01hcey7qcfeeqmh1af6x3xafa2'


curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows" \
    -X POST \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "auto_complete": true,
        "flow_id": "'"${my_template_id}"'",
        "records": {
            "employee": "'"${record_id}"'"
        }
    }' |
    jq
```

```javascript
var templateId = 2;
var employeeRecord = 'rec_01hcey7qcfeeqmh1af6x3xafa2';

var data = {
    auto_complete: true,
    flow_id: templateId,
    records: {
        employee: employeeRecord,
    },
};
var payload = JSON.stringify(data, null, 2);

var url = `${paperBase}/api/v1/orgs/${my_org_id}/workflows`;
var resp = await fetch(url, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${paperToken}`,
        'Content-Type': 'application/json',
    },
    body: payload,
});
var workflowInfo = await resp.json();

console.log(workflowInfo);
```

> Example Response:

```json
{
    "status": "success",
    "workflow_id": "wrk_01hcn8arzxb9heq3saaf97b7bx"
}
```

Prepopulate a new workflow instance:

1. See the _Records_ section to create the record that will be referenced here.
2. List those record when opening a workflow to make them available for
   autofill.

TODO: create slug for library item

## List Org Workflows

> `GET /api/v1/orgs/:org_id/workflows`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" |
  jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${my_org_id}/workflows`;
var resp = await fetch(url, {
    headers: { Authorization: `Bearer ${paperToken}` },
});
var workflowLibrary = await resp.json();

console.log(workflowLibrary);
```

> Example JSON Response

```json
{
    "success": "true",
    "total": 1,
    "count": 1,
    "workflows": [
        {
            "pub_id": "work_j2qxreh675bam141",
            "label": "Ranes Account Setup Workflow",
            "workflow_template_id": 183,
            "status": null,
            "created_at": "2023-11-07T00:14:24.000Z",
            "updated_at": "2023-11-07T00:14:24.000Z"
        }
    ]
}
```

View Started & Completed Workflows for your Organization.

## List Workflow Templates Library

> `GET /api/v1/orgs/:org_id/workflow_templates`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflow_templates" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" |
  jq
```

```javascript
var url = `${paperBase}/api/v1/orgs/${my_org_id}/workflow_templates`;
var resp = await fetch(url, {
    headers: { Authorization: `Bearer ${paperToken}` },
});
var workflowLibrary = await resp.json();

console.log(workflowLibrary);
```

```json
{
    "success": true,
    "count": 3,
    "total": 3,
    "type": "[]<workflow_template>",
    "workflow_templates": [
        {
            "id": "flow_bj2gg9f595cjd5s2",
            "label": "Account Setup Workflow",
            "description": "Setup account to prepare for employee onboarding and workflow tools."
        },
        {
            "id": "flow_bj2ggn9q3hzhso7v",
            "label": "Employee Onboarding Assessment",
            "description": null
        },
        {
            "id": "flow_bj2ggkmttyawfpgg",
            "label": "Training Certificate Assessment",
            "description": "Complete a Training Certificate. Form ID 5000-23"
        }
    ]
}
```

View Workflow Library for your Organization.

> TODO: Update json response.
