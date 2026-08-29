# Subject Prerequisites Implementation

## Overview

Subject prerequisites is a relationship table between a subject and its required prerequisite subject. This model supports the rule:

- A subject can have many prerequisites
- A subject can also be a prerequisite for many other subjects

## Model fields

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| subjectId | UUID | Subject that requires the prerequisite |
| prerequisiteSubjectId | UUID | Subject that acts as the prerequisite |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Last updated timestamp |
| deletedAt | DateTime \| null | Soft delete marker |

## Repository contract

The repository available at `packages/shared/src/infrastructure/repository/subject-prerequisites.repository.ts` exposes the following methods:

- `create(data)`
- `findById(id)`
- `findBySubjectId(subjectId)`
- `findByPrerequisiteSubjectId(prerequisiteSubjectId)`
- `findAll()`
- `update(id, data)`
- `delete(id)`

## Example payloads

### Create

```json
{
  "subjectId": "11111111-1111-1111-1111-111111111111",
  "prerequisiteSubjectId": "22222222-2222-2222-2222-222222222222"
}
```

### Response

```json
{
  "id": "33333333-3333-3333-3333-333333333333",
  "subjectId": "11111111-1111-1111-1111-111111111111",
  "prerequisiteSubjectId": "22222222-2222-2222-2222-222222222222",
  "createdAt": "2026-08-29T00:00:00.000Z",
  "updatedAt": "2026-08-29T00:00:00.000Z",
  "deletedAt": null
}
```

## Frontend usage notes

- Use `subjectId` to list all prerequisites for a subject.
- Use `prerequisiteSubjectId` to find which subjects depends on a certain prerequisite.
- The repository uses soft delete, so records with `deletedAt !== null` are excluded from retrieval queries.
- The relationship is unique per pair: `subjectId + prerequisiteSubjectId` must be unique.

## Validation rule

The pair of `subjectId` and `prerequisiteSubjectId` should never point to the same subject. This should be enforced at application level when creating or updating mappings.
