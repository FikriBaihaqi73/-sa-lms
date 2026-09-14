# Search for Module Contents, Institutions, and Departments

## Endpoints

| Resource | Endpoint | Search field |
| --- | --- | --- |
| Module contents | `GET /module-contents` | `title` |
| Institutions | `GET /institutions` | `name` |
| Departments | `GET /departments` | `name` |

Each endpoint accepts the optional query parameters `page` (default `1`), `limit` (default `10`), and `search`. The `search` value performs a case-insensitive partial match and excludes soft-deleted records.

Example:

```http
GET /institutions?page=1&limit=10&search=academy
Authorization: Bearer <access-token>
```

## Successful response

```json
{
  "status": "success",
  "message": "Institutions retrieved successfully",
  "data": [],
  "code": 200,
  "meta": {
    "totalData": 0,
    "totalPages": 0,
    "currentPage": 1,
    "perPage": 10
  }
}
```

## Frontend flow

1. Send the user's text as the optional `search` query parameter.
2. Reset `page` to `1` when the search text changes.
3. Render `data` and update pagination from `meta`.
4. Omit `search` or send an empty value to retrieve all non-deleted records.
