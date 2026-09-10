INSERT INTO "roles" ("id", "name", "description", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'student',
  'Default role assigned to self-registered users',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("name") DO UPDATE
SET
  "deleted_at" = NULL,
  "updated_at" = CURRENT_TIMESTAMP;
