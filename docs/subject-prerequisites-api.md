# Subject Prerequisites API

All endpoints require the JWT authentication header used by the API:

```http
Authorization: Bearer <accessToken>
```

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/subject-prerequisites` | Create a subject prerequisite relation |
| `GET` | `/subject-prerequisites` | List relations with pagination and search |
| `GET` | `/subject-prerequisites/:id` | Get one relation |
| `PATCH` | `/subject-prerequisites/:id` | Update one relation |
| `DELETE` | `/subject-prerequisites/:id` | Soft-delete one relation |

## Create and update

```json
{
  "subjectId": "11111111-1111-1111-1111-111111111111",
  "prerequisiteSubjectId": "22222222-2222-2222-2222-222222222222"
}
```

Both IDs must reference active subjects, and a subject cannot reference itself. The
subject/prerequisite pair is unique.

## List

`GET /subject-prerequisites?page=1&limit=10&search=math`

- `page`: positive integer, default `1`.
- `limit`: positive integer, default `10`.
- `search`: optional case-insensitive search over both subjects' `code` and `name`.

The response follows the existing API format. `data` contains the relation rows,
each with eager-loaded `subject` and `prerequisiteSubject` objects, and `meta`
contains `totalData`, `totalPages`, `currentPage`, and `perPage`.

Deletes are soft deletes; deleted relations are excluded from list and detail
queries.
