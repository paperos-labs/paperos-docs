---
weight: 1100
title: Accounts
---

# Accounts

## List User's Accounts

```shell
my_accounts="$(

    curl "${PAPEROS_BASE_URL}/api/user/accounts" \
        -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"

)"
echo "${my_accounts}"
```

```javascript
var url = `${paperBase}/api/user/accounts`;
var resp = await fetch(url, {
    headers: { Authorization: `Bearer ${paperToken}` },
});
var accounts = await resp.json();

console.log(accounts);
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

Retrieve all accounts associated with this user, including through direct ownership, delegation, or partnerships.

### HTTP Request

`GET /api/user/accounts`

## Account Token Debug Info

```shell
my_account_id="$(
    echo "${my_accounts}" |
        jq '.[0].id'
)"

curl "${PAPEROS_BASE_URL}/api/account/debug?account_id=${my_account_id}" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"
```

```javascript
var accountId = accounts[0].id;
var url = `${paperBase}/api/account/debug?account_id=${accountId}`;
var resp = await fetch(url, {
    headers: { Authorization: `Bearer ${paperToken}` },
});
var accountInfo = await resp.json();
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

### Query Parameters

| Parameter  | Default | Description                                         |
| ---------- | ------- | --------------------------------------------------- |
| account_id | ''      | Either required or disallowed, based on token type. |
