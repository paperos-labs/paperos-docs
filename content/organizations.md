---
weight: 1100
title: Organizations
---

# Organizations

## Create Org

> `POST /api/v1/orgs`

```shell
my_org="$(

curl "${PAPEROS_BASE_URL}/api/v1/orgs" \
    -X 'POST' \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "name": "My For Profit Test Co",
        "fields": {
            "business_type": "for_profit"
        }
    }'
)"
echo "${my_orgs}" |
    jq
```

```javascript
var data = {
    name: 'My Test Company 11',
    fields: {
        business_type: 'for_profit',
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

Create a new organization.

Options for `business_type` are:

-   `for_profit`
-   `investment_vehicle`
-   `professional_services`
-   `other`

## View Org by Id

> `GET /api/v1/orgs/:org_id`

```shell
my_org_id="$(
    echo "${my_org}" |
        jq '.id'
)"
echo "${my_org_id}"

curl "${PAPEROS_BASE_URL}/api/v1/orgs/${my_org_id}" \
  -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" |
  jq
```

```javascript
var orgId = myOrgs.orgs[0].id;
var url = `${paperBase}/api/v1/orgs/${orgId}`;
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

Show Organization Info

## List All Orgs

> `GET /api/v1/orgs?updated_since=0`

```shell
curl -G "${PAPEROS_BASE_URL}/api/v1/orgs" \
--data-urlencode "updated_since=0" \
    -H "Authorization: Bearer ${PAPEROS_API_TOKEN}" |
    jq
```

```javascript
var params = { updated_since: 0 };
var search = new URLSearchParams(params).toString();

var url = `${paperBase}/api/v1/orgs?${search}`;
var resp = await fetch(url, {
    headers: { Authorization: `Bearer ${paperToken}` },
});
var orgsInfo = await resp.json();

console.log(orgsInfo);
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

Retrieve all orgs associated with the user of the api token, including through
direct ownership, delegation, or partnerships.

### Query Parameters

| Parameter       | Default | Description                                      |
| --------------- | ------- | ------------------------------------------------ |
| `updated_since` | ''      | required, pass 0 or the previous `updated_since` |
