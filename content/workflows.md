---
weight: 1300
title: Workflows
---

# Workflows

The Workflow Library shows each of the available form collections for a particular task.

## List All

> `GET /api/v1/org/workflow_templates`
>
> `GET /api/v1/orgs/:org_id/workflow_templates`

```shell
my_org_id="$(
    echo "${my_orgs}" |
        jq '.[0].id'
)"

curl "${PAPEROS_BASE_URL}/api/v1/org/workflow_templates?account_id=${my_org_id}" \
  -H "Authorization: Bearer ${OIDC_ACCESS_TOKEN}" |
  jq
```

```javascript
var orgId = accounts[0].id;
var url = `${paperBase}/api/v1/org/workflow_templates?account_id=${my_org_id}`;
var resp = await fetch(url, {
   headers: { Authorization: `Bearer ${paperToken}` },
});
var library = await resp.json();

console.log(library);
```

> Example Response:

```json
{
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
}
```

## Open a Workflow

> `POST /api/v1/org/workflow/:workflow_template_id`
>
> `POST /api/v1/orgs/:org_id/workflow/:workflow_template_id`

```shell
my_template_id='2'

curl "${PAPEROS_BASE_URL}/api/v1/org/workflow/${my_template_id}?account_id=${my_org_id}" \
    -X POST \
    -H "Authorization: Bearer ${OIDC_ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' |
    jq
```

```javascript
var templateId = 2;
var params = { account_id: orgId };
var search = new URLSearchParams(params).toString();

var url = `${PAPEROS_BASE_URL}/api/v1/org/workflow/${my_template_id}?account_id=${my_org_id}`;
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Bearer ${paperToken}`,
   },
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

## Open with Prepopulated Data

> `POST /api/account/project_template/:template_id/create`

```shell
my_template_id='2'
my_employee_record='5617'

curl "${PAPEROS_BASE_URL}/api/v1/org/workflow/${my_template_id}?account_id=${my_org_id}" \
    -X POST \
    -H "Authorization: Bearer ${OIDC_ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "records": {
            "employee": "'"${my_employee_record}"'"
        },
        "auto_complete": true
    }' |
    jq
```

```javascript
var templateId = 2;
var employeeRecord = "5617";

var data = {
   records: {
      employee: employeeRecord,
   },
   auto_complete: true,
};
var payload = JSON.stringify(data, null, 2);

var params = { account_id: orgId };
var search = new URLSearchParams(params).toString();
var url = `${paperBase}/api/v1/org/workflow${templateId}?${search}`;
var resp = await fetch(url, {
   method: "POST",
   headers: {
      Authorization: `Bearer ${paperToken}`,
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
