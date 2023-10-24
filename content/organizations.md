---
weight: 1100
title: Organizations
---

# Organizations

## List (v1-draft)

> `GET /api/v1/orgs?updated_since=0`

```shell
my_orgs="$(

    curl "${PAPEROS_BASE_URL}/api/v1/orgs?updated_since=0" \
        -H "Authorization: Bearer ${PAPEROS_API_TOKEN}"

)"
echo "${my_orgs}" |
    jq
```

```javascript
var url = `${paperBase}/api/v1/orgs?updated_since=0`;
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

Retrieve all orgs associated with this user, including through direct ownership,
delegation, or partnerships.

### Query Parameters

| Parameter       | Default | Description                                      |
| --------------- | ------- | ------------------------------------------------ |
| `updated_since` | ''      | required, pass 0 or the previous `updated_since` |

## View Token Debug Info

> `GET /api/v1/org/debug`

```shell
my_org_id="$(
    echo "${my_orgs}" |
        jq '.[0].id'
)"
echo "${my_org_id}"

curl "${PAPEROS_BASE_URL}/api/v1/org/debug?account_id=${my_org_id}" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" |
  jq
```

```javascript
var orgId = orgs[0].id;
var url = `${paperBase}/api/v1/org/debug?account_id=${orgId}`;
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
    "originalUrl": "/api/v1/org/debug?account_id=97"
}
```

Show account token details

### Query Parameters

| Parameter    | Default | Description                                         |
| ------------ | ------- | --------------------------------------------------- |
| `account_id` | ''      | Either required or disallowed, based on token type. |

## Create (v1-draft)

> `POST /api/v1/orgs`

```shell
curl "${PAPEROS_BASE_URL}/api/v1/orgs" \
    -X 'POST' \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "name": "My Test Company 11",
        "fields": {
            "business_type": "for_profit"
        }
    }' |
    jq
```

```javascript
var data = {
    name: 'My Test Company 11',
    fields: {
        'business_type': 'for_profit',
    },
};
var payload = JSON.stringify(data, null, 2);

var url = `${paperBase}/api/v1/orgs`;
var resp = await fetch(url, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${paperToken}`,
        'Content-Type': 'application/json',
    },
    body: payload,
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

Create a new organization.

Options for `business_type` are:

-   `for_profit`
-   `investment_vehicle`
-   `professional_services`
-   `other`
