---
weight: 2000
title: Errors
---

# Errors

<aside class="notice">Our public API is under development. Please contact us if you encounter unexpected behavior.</aside>

The PaperOS API uses the following error codes:

## 4xx

| Error Code | Meaning                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| 400        | Bad Request -- Some of the query params or body props were missing or invalid |
| 401        | Unauthorized -- The API key, user, or account is invalid or expired           |
| 402        | Payment Required -- The account must be upgraded to use this feature          |
| 403        | Forbidden -- The given key, user, or account doesn't have access              |
| 404        | Not Found -- The specified data was not found                                 |
| 405        | Method Not Allowed -- A GET was used where a POST was required, etc           |
| 406        | Not Acceptable -- The data was not in the proper format (i.e. JSON, CSV)      |
| 420        | Enhance Your Calm -- You're doing that too fast                               |
| 422        | Unprocessable Content -- The format is correct, but the data is not           |
| 429        | Too Many Requests -- alias of 420                                             |

## 5xx

| Error Code | Meaning                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| 500        | Internal Server Error -- We had a problem with our server. Please let us know |
| 501        | Not Implemented -- The feature you tried to use is still in development       |
| 502        | Bad Gateway -- The application may be restarting                              |
