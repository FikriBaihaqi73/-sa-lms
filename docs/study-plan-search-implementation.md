# Study Plan Search

## Endpoint

`GET /study-plans?page=1&limit=10&search=mathematics`

The optional `search` parameter performs a case-insensitive partial match on:

- Student number
- Subject name or subject code
- Academic year

It can be combined with the existing `student_id`, `class_subject_id`, and `academic_year_id` filters. Soft-deleted study plans are always excluded.

## Successful response

```json
{
  "status": "success",
  "message": "Study plans retrieved successfully",
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

1. Send the user's search text through the optional `search` query parameter.
2. Reset `page` to `1` whenever the search text or an ID filter changes.
3. Render the returned `data` and paginate using `meta`.
