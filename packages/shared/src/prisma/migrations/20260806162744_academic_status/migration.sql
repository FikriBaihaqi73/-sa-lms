-- CreateTable
CREATE TABLE "AcademicStatuses" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "AcademicStatuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicStatuses_name_key" ON "AcademicStatuses"("name");

-- CreateIndex
CREATE INDEX "AcademicStatuses_name_idx" ON "AcademicStatuses"("name");
