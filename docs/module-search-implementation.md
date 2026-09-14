# Learning Module Search

## Endpoint

`GET /modules`

## Query parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | number | No | Page number. Default: `1`. |
| `limit` | number | No | Items per page. Default: `10`. |
| `search` | string | No | Case-insensitive partial match against the learning module title. |

Example request:

```http
GET /modules?page=1&limit=10&search=mathematics
Authorization: Bearer <access-token>
```

## Successful response

```json
{
  "status": "success",
  "message": "Learning modules retrieved successfully",
  "data": [
    {
      "id": "9d7a5dd3-86c0-49a3-9a7f-9ea501c91350",
      "title": "Mathematics Fundamentals",
      "class_subject_id": "a8a24b7f-9d9f-4e60-b9b5-b9c5d1bcf899"
    }
  ],
  "code": 200,
  "meta": {
    "totalData": 1,
    "totalPages": 1,
    "currentPage": 1,
    "perPage": 10
  }
}
```

## Frontend flow

1. Store the user's search text in the module-list state.
2. Send it as the optional `search` query parameter together with the current pagination values.
3. Render the returned `data` list and use `meta` to update pagination controls.
4. Reset the page to `1` whenever the search text changes.

An empty or omitted `search` value returns all non-deleted modules. Searches do not match soft-deleted modules.
