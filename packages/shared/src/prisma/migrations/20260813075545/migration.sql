-- CreateTable
CREATE TABLE "Announcements" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "content" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "Announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Files" (
    "id" UUID NOT NULL,
    "original_name" VARCHAR NOT NULL,
    "file_name" VARCHAR NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_extension" VARCHAR,
    "mime_type" VARCHAR,
    "file_size" BIGINT,
    "uploaded_by" UUID,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Announcements_institution_id_idx" ON "Announcements"("institution_id");

-- CreateIndex
CREATE INDEX "Announcements_created_by_idx" ON "Announcements"("created_by");

-- CreateIndex
CREATE INDEX "Announcements_updated_by_idx" ON "Announcements"("updated_by");

-- CreateIndex
CREATE INDEX "Announcements_deleted_by_idx" ON "Announcements"("deleted_by");

-- CreateIndex
CREATE INDEX "Files_uploaded_by_idx" ON "Files"("uploaded_by");

-- AddForeignKey
ALTER TABLE "Announcements" ADD CONSTRAINT "Announcements_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcements" ADD CONSTRAINT "Announcements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcements" ADD CONSTRAINT "Announcements_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcements" ADD CONSTRAINT "Announcements_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
