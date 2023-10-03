---
weight: 1100
title: Organizations
---

# Organizations

## List (v1-draft)

> `GET /api/user/v1/orgs?updated_since=0`

```shell
my_orgs="$(

    curl "${PAPEROS_BASE_URL}/api/user/v1/orgs?updated_since=0" \
        -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"

)"
echo "${my_orgs}" |
    jq
```

```javascript
var url = `${paperBase}/api/user/v1/orgs?updated_since=0`;
var resp = await fetch(url, {
  headers: { Authorization: `Bearer ${paperToken}` },
});
var orgs = await resp.json();

console.log(orgs);
```

> Example Response:

```json
{
  "updated_at": 1677000469,
  "orgs": [
    {
      "id": "org_01ewdxxpvgg2y19pbtbyddtvv8",
      "name": "Test 1",
      "brand_id": "brand_00000000000000000000000000",
      "created_at": "2021-01-19T18:18:46.000Z",
      "updated_at": "2023-02-21T17:27:49.000Z"
    }
  ]
}
```

Retrieve all orgs associated with this user, including through direct ownership, delegation, or partnerships.

## List (internal)

> `GET /api/user/accounts`

```shell
my_orgs="$(

    curl "${PAPEROS_BASE_URL}/api/user/accounts" \
        -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"

)"
echo "${my_orgs}" |
    jq
```

```javascript
var url = `${paperBase}/api/user/accounts`;
var resp = await fetch(url, {
  headers: { Authorization: `Bearer ${paperToken}` },
});
var orgs = await resp.json();

console.log(orgs);
```

> Example Response:

```json
[
  {
    "user_id": 64,
    "user_email": "services+test1@savvi.legal",
    "account_id": 97,
    "account_name": "Test 1",
    "account_group": null,
    "account_order": null,
    "role": "Owner",
    "partner_id": null,
    "partner": "N/A",
    "full_access": 1,
    "is_current": 1,
    "role_id": 1,
    "filecabinet_access": 1,
    "documents": [],
    "account": {
      "id": 97,
      "status_id": 1,
      "stripe_id": "cus_Imykh8pE29UlEo",
      "box_id": "14998733037",
      "created_at": "2021-01-19T18:18:46.000Z",
      "updated_at": "2023-02-21T17:27:49.000Z",
      "box_root_folder_id": "129983737996",
      "name": "Test 1",
      "stage": null,
      "entity_type": null,
      "signatory_id": null,
      "is_test": 1,
      "counsel_agreement_id": null,
      "managing_attorney_id": 2,
      "hubspot_id": "5206794884",
      "document_credit_rate": 0,
      "subscription_date": "2023-02-21T17:27:49.000Z",
      "last_credit_date": "2023-02-21T17:27:49.000Z",
      "next_credit_date": "2023-03-21T17:27:49.000Z",
      "credit_period": "month",
      "onboard": 0,
      "user_limit": 2,
      "brand_ulid": "00000000000000000000000000"
    },
    "id": 97,
    "name": "Test 1",
    "created_at": "2021-01-19T18:18:46.000Z"
  }
]
```

Retrieve all orgs associated with this user, including through direct ownership, delegation, or partnerships.

## View Token Debug Info

> `GET /api/account/debug`

```shell
my_org_id="$(
    echo "${my_orgs}" |
        jq '.[0].id'
)"
echo "${my_org_id}"

curl "${PAPEROS_BASE_URL}/api/account/debug?account_id=${my_org_id}" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" |
  jq
```

```javascript
var orgId = orgs[0].id;
var url = `${paperBase}/api/account/debug?account_id=${orgId}`;
var resp = await fetch(url, {
  headers: { Authorization: `Bearer ${paperToken}` },
});
var orgInfo = await resp.json();
```

> Example Response:

```json
{
  "user": {
    "account_id": 97,
    "partner_id": null,
    "auth_time": "2023-09-19T22:25:54.000Z",
    "iat": "2023-09-19T22:25:54.000Z",
    "exp": null,
    "api_token": true,
    "email": "services+test1@savvi.legal"
  },
  "method": "GET",
  "originalUrl": "/api/account/debug?account_id=97"
}
```

Show account token details

### Query Parameters

| Parameter    | Default | Description                                         |
| ------------ | ------- | --------------------------------------------------- |
| `account_id` | ''      | Either required or disallowed, based on token type. |

## Create

> `POST /api/user/accounts`

```shell
curl "${PAPEROS_BASE_URL}/api/user/accounts" \
    -X 'POST' \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "company_name": "My Test Company 11",
        "features": [
            { "feature_type_id": 881, "value": "For-profit Company" },
        ],
        "inputs": {
            "org:business_type": "for_profit"
        }
    }' |
    jq
```

```javascript
var data = {
  company_name: "My Test Company 11",
  features: [{ feature_type_id: 881, value: "For-profit Company" }],
  inputs: {
    "org:business_type": "for_profit",
  },
};
var payload = JSON.stringify(data, null, 2);

var url = `${paperBase}/api/user/accounts`;
var resp = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${paperToken}`,
    "Content-Type": "application/json",
  },
  body: payload,
});
var orgInfo = await resp.json();
```

> Example Response:

```json
{
  "account_id": 230755971
}
```

Create a new organization.

Options for `org:business_type` are:

- `for_profit`
- `investment_vehicle`
- `professional_services`
- `other`
