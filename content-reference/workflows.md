---
weight: 1300
title: Workflows
---

# Workflows

The Workflow Library shows each of the available form collections for a particular task.

## List All Workflow Templates

Get list of all available Workflow Templates.

> `GET /api/v1/orgs/:org_id/workflow-templates`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflow-templates" \
  -H "Authorization: Bearer ${OIDC_ACCESS_TOKEN}" |
  jq
```

```javascript
var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflow-templates`;
var resp = await fetch(url, {
   headers: {
      Authorization: `Bearer ${OIDC_ACCESS_TOKEN}`,
   },
});
var library = await resp.json();

console.log(library);
```

> Example Response: (simplified for readability)

```json
{
   "success": true,
   "count": 71,
   "total": 71,
   "type": "[]<workflow_template>",
   "workflow_templates": [
      {
         "id": "flow_extg0vcffk3h9085",
         "label": "Entity Setup",
         "description": "Form a new entity, or upload your documentation for an existing entity.",
         "created_at": "2023-12-29T18:56:00.000Z",
         "updated_at": "2025-05-08T22:07:38.000Z"
      },
      {
         "id": "flow_extg0yj9vywzabwy",
         "label": "Fundraising Diligence Portal",
         "description": "Share pitch materials with prospective investors for initial screening. Set up custom Diligence Rooms to respond to requests & share relevant Data Room documentation.",
         "created_at": "2023-12-29T18:56:00.000Z",
         "updated_at": "2025-05-08T22:03:20.000Z"
      },
      {
         "id": "flow_extg0g5yjfrtfk3e",
         "label": "Onboard Employees",
         "description": "Onboard employees and generate appropriate documents. Or upload the documents that you've already executed.",
         "created_at": "2023-12-29T18:56:00.000Z",
         "updated_at": "2025-05-08T22:07:44.000Z"
      },
      {
         "id": "flow_extg0z7hs83avjbt",
         "label": "Annual Report (State Renewal)",
         "description": "Complete the annual report required by each state in which your company is registered.",
         "created_at": "2023-12-29T18:56:00.000Z",
         "updated_at": "2024-11-20T18:21:08.000Z"
      },
      {
         "id": "flow_extg0h07e96b2etx",
         "label": "Data Room Setup",
         "description": "Set up a custom data room that you can manage and share with relevant parties.",
         "created_at": "2023-12-29T18:56:00.000Z",
         "updated_at": "2023-12-02T00:33:47.000Z"
      },
      {
         "id": "flow_extg0v4ndq47rnwk",
         "label": "Doc Send & Sign",
         "description": "Send and Sign Custom Documents.",
         "created_at": "2023-12-29T18:56:00.000Z",
         "updated_at": "2024-10-31T00:05:52.000Z"
      }
      // ...rest of available templates
   ]
}
```

<!-- Old Response with non-massaged data {
   "success": true,
   "count": 2,
   "type": "[]<workflow_template>",
   "workflows": [
      {
         "id": 1,
         "label": "Entity Setup",
         "description": "Form a new C-Corporation or LLC, or upload your documentation for an existing entity.",
         "module_id": 2,
         "prerequisites": {},
         "is_repeatable": 0,
         "in_development": 0,
         "admin_label": null,
         "order_by": 10,
         "role_id": 2,
         "permissions": 1,
         "faqs": [
            {
               "id": 4,
               "header": "What if I've already formed my company?",
               "body": "If you've already completed some or all of your entity formation documents, complete the entity setup project to upload existing documents and generate any remaining ones. This will allow us to reference your legal documents when preparing other legal documents later on (some of our tasks have prerequisite requirements). It also gives you a secure file cabinet to organize your documents and ensure you have the required documents when you need them.",
               "label": "Already Formed Entity"
            },
            {
               "id": 17,
               "header": "How do I get started?",
               "body": "Begin the Entity Setup project. The Entity Assessment will help you figure out what you need to do next. ",
               "label": "Entity Setup Instructions"
            }
         ],
         "projects": [],
         "attached_partners": [],
         "transactions": [
            {
               "id": 7,
               "description": "Answer these questions about your company so we can get you started on the right track.",
               "label": "Entity Assessment",
               "is_deletable": 1,
               "is_assessment": 1,
               "validators": [
                  {
                     "type": "IsNotRequired",
                     "resource": "Operating State"
                  }
               ],
               "delete_level": "unsubmitted",
               "importance": 5,
               "specialization_id": null,
               "admin_label": null,
               "redline_available": 1,
               "low_visibility": 0,
               "resource_requirements": {},
               "counsel_data": {},
               "tasks": [
                  {
                     "id": 78,
                     "order": 1,
                     "module_id": 2,
                     "label": "Entity Assessment",
                     "description": "Entity Assessment",
                     "prerequisites": {
                        "subscriptions": []
                     },
                     "subtasks": null,
                     "deliverables": [],
                     "created_at": "2019-07-30T23:16:42.000Z",
                     "updated_at": "2023-06-09T20:52:12.000Z",
                     "upload_path": null,
                     "parent_task_id": null,
                     "is_repeatable": null,
                     "in_development": 0,
                     "document_description": null,
                     "task_slug": null,
                     "has_subtask_prerequisties": 0,
                     "hidden_status": "Locked",
                     "custom_submit_message": null,
                     "child_label": null,
                     "product_id": 59,
                     "resources": [
                        {
                           "name": "Company",
                           "resource_id": [],
                           "feature_type_ids": [],
                           "label": "Company",
                           "resource_type_id": 2
                        }
                     ],
                     "task_event": {
                        "questionnaire": [77],
                        "modes": {
                           "Generate": {},
                           "Upload": {
                              "use_document_credits": true,
                              "document_credits": 0,
                              "use_product": true,
                              "product_id": 59,
                              "skip_events": true,
                              "skip_document": true,
                              "skip_email": true,
                              "skip_ticket": true,
                              "skip_outside": true
                           }
                        },
                        "all_features": [51, 327, 69, 68, 648]
                     },
                     "type": "System",
                     "hubspot_label": "Entity Assessment",
                     "hubspot_assigner": {},
                     "hubspot_pipeline": null,
                     "hubspot_task_days": 1,
                     "version": "2",
                     "submitted_at": null,
                     "transaction_actions": {
                        "Generate": true,
                        "Upload": true
                     },
                     "admin_label": "Entity Assessment",
                     "document_counter": 0,
                     "specialization_id": null,
                     "custom_document": 0,
                     "mode": "Generate",
                     "instant_report": 0,
                     "type_label": null,
                     "ledger_type": "entity_assessment"
                  }
               ]
            }
         ],
         "status": "Available"
      },
      {
         "id": 2,
         "label": "Onboard Employees",
         "description": "Onboard employees and generate appropriate documents. Or upload the documents that you've already executed.",
         "module_id": 4,
         "prerequisites": {},
         "is_repeatable": 1,
         "in_development": 0,
         "admin_label": null,
         "order_by": 60,
         "role_id": 2,
         "permissions": 1,
         "faqs": [],
         "projects": [],
         "attached_partners": [],
         "transactions": [
            {
               "id": 15,
               "description": "Enter the names of each employee you want to onboard.",
               "label": "Onboard Employees",
               "is_deletable": 1,
               "is_assessment": 1,
               "validators": [],
               "delete_level": "unsubmitted",
               "importance": 0,
               "specialization_id": null,
               "admin_label": null,
               "redline_available": 0,
               "low_visibility": 0,
               "resource_requirements": {},
               "counsel_data": {},
               "tasks": [
                  {
                     "id": 127,
                     "order": null,
                     "module_id": 1,
                     "label": "Onboard Employees",
                     "description": "Here documents needed to onboard a new employee (including an employee offer letter, PIIA, non-compete agreement, and indemnification agreement) will be generated.",
                     "prerequisites": {},
                     "subtasks": [],
                     "deliverables": [],
                     "created_at": "2019-08-27T20:10:02.000Z",
                     "updated_at": "2022-10-26T23:15:44.000Z",
                     "upload_path": null,
                     "parent_task_id": null,
                     "is_repeatable": null,
                     "in_development": 0,
                     "document_description": null,
                     "task_slug": null,
                     "has_subtask_prerequisties": 0,
                     "hidden_status": "Locked",
                     "custom_submit_message": null,
                     "child_label": null,
                     "product_id": 6,
                     "resources": [
                        {
                           "name": "Individual",
                           "resource_type_id": 1,
                           "resource_id": [],
                           "feature_type_ids": [1, 349, 729],
                           "label": "Employee",
                           "custom_label": "New Employee",
                           "multi_entry": true
                        }
                     ],
                     "task_event": {
                        "questionnaire": [],
                        "modes": {
                           "Generate": {}
                        },
                        "all_features": [51, 1, 349, 729]
                     },
                     "type": "System",
                     "hubspot_label": "",
                     "hubspot_assigner": {},
                     "hubspot_pipeline": null,
                     "hubspot_task_days": 1,
                     "version": "2",
                     "submitted_at": null,
                     "transaction_actions": {
                        "Generate": true
                     },
                     "admin_label": "Onboard Employees",
                     "document_counter": 0,
                     "specialization_id": null,
                     "custom_document": 0,
                     "mode": "Generate",
                     "instant_report": 0,
                     "type_label": null,
                     "ledger_type": "onboard_employees"
                  }
               ]
            }
         ],
         "status": "Repeatable"
      }
   ],
   "total": 2
} -->

## List All Started Workflows

Get List of started Workflows. Each Workflow was generated from a Workflow Template above.

> `GET /api/v1/orgs/:org_id/workflows`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows" \
  -H "Authorization: Bearer ${OIDC_ACCESS_TOKEN}" |
  jq
```

```javascript
var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows`;
var resp = await fetch(url, {
   headers: {
      Authorization: `Bearer ${OIDC_ACCESS_TOKEN}`,
   },
});
var workflows = await resp.json();

console.log(workflows);
```

> Example Response:

```json
{
   "success": true,
   "total": 1,
   "count": 1,
   "workflows": [
      {
         "id": "work_q0yjdgdr77rdnedc",
         "label": "Entity Setup",
         "template_id": "flow_extg0vcffk3h9085",
         "status": "open",
         "created_at": "2025-10-22T19:41:06.000Z",
         "updated_at": "2025-10-22T19:50:07.000Z"
      }
   ]
}
```

## Start a Workflow

> `POST /api/v1/orgs/:org_id/workflows`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows" \
  -X 'POST' \
  -H "Authorization: Bearer ${OIDC_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
   --data-raw '{
      "flow_id": "${my_flow_id}"
    }' |
  jq
```

```javascript
var data = {
   flow_id: my_flow_id,
};
var payload = JSON.stringify(data, null, 2);

var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows`;
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Bearer ${OIDC_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
   },
   body: payload,
});
var workflow = await resp.json();

console.log(workflow);
```

> Example Response:

```json
{
   "status": "success",
   "workflow_id": "wrk_01hcn8arzxb9heq3saaf97b7bx"
}
```

Opening a workflow will create the associated To-Do items in the PaperOS interface.

## Start a Workflow with Prepopulated Data & Auto Submit

> `POST /api/v1/orgs/:org_id/workflows`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows" \
  -X 'POST' \
  -H "Authorization: Bearer ${OIDC_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
   --data-raw '{
      "flow_id": "${my_flow_id}",
      "records": [{
        "role": "company",
        "id": "rec_kp9fh3354dqt255m"
      }],
      "auto_submit": 1
    }' |
  jq
```

```javascript
var data = {
   flow_id: my_flow_id,
   records: [
      {
         role: "company",
         id: "rec_kp9fh3354dqt255m",
      },
   ],
   auto_submit: 1,
};
var payload = JSON.stringify(data, null, 2);

var url = `${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}/workflows`;
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Bearer ${OIDC_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
   },
   body: payload,
});
var workflow = await resp.json();

console.log(workflow);
```

> Example Response:

```json
{
   "status": "success",
   "workflow_id": "wrk_01hcn8arzxb9heq3saaf97b7bx"
}
```

Prepopulate a new workflow instance:

1. See the _Records_ section to create the resources that will be referenced here.
2. List those resources when opening a workflow to make them available for autofill.

TODO: create slug for library item
