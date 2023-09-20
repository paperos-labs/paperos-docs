---
weight: 1200
title: Resources
---

# Resources

Resources are the collections of data that can be both the result of form submissions, and made available for autofill selection to future forms.

## Create One

> Create a new resource instance

```shell
curl "$PAPEROS_BASE_URL/api/account/v1/resources/individual?account_id=${my_account_id}" \
    -X 'POST' \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN"
    -H 'Content-Type: application/json' \
    --data-raw '{
        "name": "Bob the Builder",
        "title": "master builder",
        "email": "bob@bobbuild.bob",
        "employee_documents_list": "All of the above",
        "upload_or_generate": "Generate"
    }'
```

```javascript
// TODO
```

> Example Response:

```json
{
    "TODO": "todo"
}
```

Create a new resource for an organization.

TODO: make `resource_type` a parameter, as to not conflict with `/resources/:id`

`POST /api/account/v1/resources/{{resource_type}}?account_id={{account_id}}`

### Resource Types

| Type                                  |
| ------------------------------------- |
| `individual`                          |
| `intellectual_property`               |
| `document`                            |
| `document`                            |
| `equity`                              |
| `task`                                |
| `questionnaire`                       |
| `securities`                          |
| `financing`                           |
| `outside_entity`                      |
| `investment`                          |
| `equity_plan`                         |
| `state`                               |
| `foreign_entity_qualification_states` |
| `company_history`                     |
| `counsel`                             |
| `secretary`                           |
| `legal_audit`                         |
| `equity_class`                        |
| `web_policy_terms`                    |
| `personal_information`                |
| `annual_report`                       |
| `contracts`                           |
| `tax_filing`                          |
| `benefit_plans`                       |
| `financials`                          |
| `quarterly_financials`                |

## List All by Org

> List all of an Org's Resources:

```shell
curl "$PAPEROS_BASE_URL/api/account/v1/resources?account_id=${my_account_id}" \
  -H "Authorization: Bearer $PAPEROS_API_TOKEN"
```

```javascript
// TODO
```

> Example Response:

```json
{
    "TODO": "todo"
}
```

Resources are scoped to a specific account.

`GET /api/account/v1/resources?account_id={{account_id}}`

## Get One by ID

> List details of a single resource

```shell
my_resource_id='23456'

curl "$PAPEROS_BASE_URL/api/account/v1/resources/${my_resource_id}?account_id=${my_account_id}" \
  -H "Authorization: Bearer $PAPEROS_API_TOKEN"
```

```javascript
// TODO
```

> Example Response:

```json
{
    "TODO": "todo"
}
```

Show details for a resource by its ID.

`GET /api/account/v1/resources/{{resource_id}}?account_id={{account_id}}`

## Update One by ID

```shell
my_resource_id='17378'

curl "$PAPEROS_BASE_URL/api/account/v1/resources/${my_resource_id}?account_id=${my_account_id}" \
    -X 'PATCH' \
    -H "Authorization: Bearer $PAPEROS_API_TOKEN"
    -H 'Content-Type: application/json' \
    --data-raw '{
        "title": "Ultra Master painter",
        "email": "bob@bobrossian.bob",
        "contractor_notes": "Paintings on a field of liquid white.",
        "name": "Bob Painter Ross"
    }'
```

```javascript
// TODO
```

> Example Response:

```json
{
    "TODO": "todo"
}
```

Update the properties of an existing resource

`PATCH {{host}}/api/account/v1/resources/{{resource_id}}?account_id={{account_id}}`
