-- CreateTable
CREATE TABLE "study_plans" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "class_subject_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "study_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" UUID NOT NULL,
    "class_subject_id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT,
    "display_order" INTEGER,
    "is_published" BOOLEAN DEFAULT false,
    "is_locked" BOOLEAN DEFAULT false,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingJournals" (
    "id" UUID NOT NULL,
    "schedule_id" UUID NOT NULL,
    "meeting_number" INTEGER,
    "journal_date" DATE,
    "topic" VARCHAR,
    "material" TEXT,
    "notes" TEXT,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "TeachingJournals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "study_plans_student_id_idx" ON "study_plans"("student_id");

-- CreateIndex
CREATE INDEX "study_plans_class_subject_id_idx" ON "study_plans"("class_subject_id");

-- CreateIndex
CREATE INDEX "study_plans_academic_year_id_idx" ON "study_plans"("academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "study_plans_student_id_class_subject_id_academic_year_id_key" ON "study_plans"("student_id", "class_subject_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "TeachingJournals_schedule_id_idx" ON "TeachingJournals"("schedule_id");

-- CreateIndex
CREATE INDEX "TeachingJournals_created_by_idx" ON "TeachingJournals"("created_by");

-- CreateIndex
CREATE INDEX "TeachingJournals_updated_by_idx" ON "TeachingJournals"("updated_by");

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_class_subject_id_fkey" FOREIGN KEY ("class_subject_id") REFERENCES "class_subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_class_subject_id_fkey" FOREIGN KEY ("class_subject_id") REFERENCES "class_subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingJournals" ADD CONSTRAINT "TeachingJournals_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingJournals" ADD CONSTRAINT "TeachingJournals_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingJournals" ADD CONSTRAINT "TeachingJournals_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
