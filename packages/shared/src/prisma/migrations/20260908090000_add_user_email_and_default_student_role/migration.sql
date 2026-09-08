-- Add the login email used by the registration endpoint.
ALTER TABLE "Users" ADD COLUMN "email" VARCHAR(255);

CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- The public registration flow assigns this role when no override is configured.
INSERT INTO "roles" (
    "id",
    "name",
    "description",
    "created_at",
    "updated_at"
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'student',
    'Default role for self-registered users',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("name") DO UPDATE
SET "deleted_at" = NULL;
