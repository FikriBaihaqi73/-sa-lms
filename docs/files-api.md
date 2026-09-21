# Files API

The files module provides CRUD operations for file metadata. File list and detail responses eagerly load the uploader's `id`, `email`, and `is_active` fields.

## List files

`GET /files?page=1&limit=10&search=report`

Query parameters:

- `page`: one-based page number; defaults to `1`.
- `limit`: items per page; defaults to `10` and is capped at `100`.
- `search`: optional case-insensitive search across original name, stored name, extension, MIME type, and uploader email.

The response uses the standard response envelope. `data` is an array of file records and `meta` contains `totalData`, `totalPages`, `currentPage`, and `perPage`.

## Get, create, update, and delete

- `GET /files/:id` returns one file and its eager-loaded uploader.
- `POST /files` accepts `original_name`, `file_name`, `file_path`, optional `file_extension`, `mime_type`, `file_size`, and `uploaded_by`.
- `PATCH /files/:id` accepts any subset of the create fields.
- `DELETE /files/:id` performs a soft delete.

`file_size` must be a non-negative integer. `uploaded_by`, when supplied, must be a UUID. The API requires the same JWT authentication as the other protected modules.