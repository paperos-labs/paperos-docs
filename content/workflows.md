---
weight: 1300
title: Workflows
---

# Workflows

The Workflow Library shows each of the available form collections for a particular task.

## List Org's Library

```shell
my_account_id="$(
    echo "${my_accounts}" |
        jq '.[0].id'
)"

curl "${PAPEROS_BASE_URL}/api/account/project_template?account_id=${my_account_id}" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" |
  jq
```

```javascript
var accountId = accounts[0].id;
var url = `${paperBase}/api/account/project_template?account_id=${my_account_id}`;
var resp = await fetch(url, {
    headers: { Authorization: `Bearer ${paperToken}` },
});
var library = await resp.json();

console.log(library);
```

> Example Response:

```json
[
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
]
```

## Open a Workflow

> Open a new workflow instance:

```shell
my_template_id='2'
my_employee_resource='17400'

curl "${PAPEROS_BASE_URL}/api/account/project_template/${my_template_id}/create?account_id=${my_account_id}" \
    -X POST \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' |
    jq
```

```javascript
var templateId = 2;
var params = { account_id: accountId };
var search = new URLSearchParams(params).toString();

var url = `${paperBase}/api/account/project_template/${templateId}/create?${search}`;
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
    "id": 7545,
    "label": "Onboard Employees",
    "description": "Onboard employees and generate appropriate documents. Or upload the documents that you've already executed.",
    "account_id": 97,
    "project_template_id": 2,
    "created_at": "2023-09-20T20:29:07.000Z",
    "updated_at": "2023-09-20T20:29:07.000Z",
    "source_action_id": null,
    "status": null,
    "transactions": [
        {
            "id": 20189,
            "label": "Onboard Employees",
            "description": "Enter the names of each employee you want to onboard.",
            "group": null,
            "open": 1,
            "account_id": 97,
            "transaction_template_id": 15,
            "created_at": "2023-09-20T20:29:07.000Z",
            "updated_at": "2023-09-20T20:29:07.000Z",
            "order": null,
            "is_started": 0,
            "submission_date": null,
            "reviewers": [],
            "redline_enabled": 0,
            "allow_reopen": 1,
            "parent_transaction": null,
            "validated_questionnaire": 0,
            "order_block": 0,
            "order_require_complete": 0,
            "submitter_id": null,
            "impersonator_id": null,
            "tasks": [
                {
                    "id": 28526,
                    "account_id": 97,
                    "template_id": 127,
                    "status_id": 1,
                    "values": {},
                    "prerequisites": null,
                    "state": "incomplete",
                    "created_at": "2023-09-20T20:29:07.000Z",
                    "updated_at": "2023-09-20T20:29:07.000Z",
                    "label": "Onboard Employees",
                    "recommended_documents": null,
                    "attorney_recommended": 0,
                    "task_product_paid": 0,
                    "paid_stripe_invoice": null,
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
                    "hubspot_task_id": null,
                    "submitted_at": null,
                    "bypassed": 0,
                    "finalize_snapshot": {},
                    "status_label": null,
                    "pandadoc_id": null,
                    "box_document_id": null,
                    "redline_enabled": 0,
                    "custom_document": 0,
                    "completion_timestamp": null,
                    "owner_user_id": null,
                    "owner_partner_id": null,
                    "owner_email": null,
                    "mode": "Generate",
                    "document_counter": 0,
                    "product_id": 6,
                    "instant_report": 0,
                    "template_type_id": "NULL",
                    "template_variant_id": ""
                }
            ]
        }
    ]
}
```

Opening a workflow will create the associated To-Do items in the PaperOS interface.

`POST /api/account/project_template/${templateId}/create`

## Open with Prepopulated Data

> Prepopulate a new workflow instance:

```shell
my_template_id='2'
my_employee_resource='17400'

curl "${PAPEROS_BASE_URL}/api/account/project_template/${my_template_id}/create?account_id=${my_account_id}" \
    -X POST \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "resources": {
            "employee": "'"${my_employee_resource}"'"
        },
        "auto_complete": true
    }' |
    jq
```

```javascript
var templateId = 2;
var params = { account_id: accountId };
var search = new URLSearchParams(params).toString();

var employeeResource = "17400";
var data = {
    resources: {
        employee: employeeResource,
    },
    auto_complete: true,
};
var payload = JSON.stringify(data, null, 2);

var url = `${paperBase}/api/account/project_template/${templateId}/create?${search}`;
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

1. See the _Resources_ section to create the resources that will be referenced here.
2. List those resources when opening a workflow to make them available for autofill.
