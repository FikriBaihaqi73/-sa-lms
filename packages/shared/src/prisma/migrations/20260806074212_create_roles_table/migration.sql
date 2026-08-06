-- CreateTable
CREATE TABLE "Roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");

-- CreateIndex
CREATE INDEX "Roles_name_idx" ON "Roles"("name");
