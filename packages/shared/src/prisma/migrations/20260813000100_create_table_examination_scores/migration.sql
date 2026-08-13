-- CreateTable
CREATE TABLE "examinations" (
    "id" UUID NOT NULL,
    "class_subject_id" UUID,
    "assignment_type_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "examination_date" TIMESTAMP,
    "duration" INTEGER,
    "maximum_score" DECIMAL(5,2),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examination_scores" (
    "id" UUID NOT NULL,
    "examination_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "score" DECIMAL(5,2),
    "notes" TEXT,
    "graded_by" UUID,
    "graded_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "examination_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "examinations_assignment_type_id_idx"
    ON "examinations" ("assignment_type_id");

-- CreateIndex
CREATE INDEX "examinations_class_subject_id_idx"
    ON "examinations" ("class_subject_id");

-- CreateIndex
CREATE INDEX "examinations_title_idx"
    ON "examinations" ("title");

-- CreateIndex
CREATE UNIQUE INDEX "examination_scores_examination_id_student_id_key"
    ON "examination_scores" ("examination_id", "student_id");

-- CreateIndex
CREATE INDEX "examination_scores_examination_id_idx"
    ON "examination_scores" ("examination_id");

-- CreateIndex
CREATE INDEX "examination_scores_student_id_idx"
    ON "examination_scores" ("student_id");

-- AddForeignKey
ALTER TABLE "examination_scores"
    ADD CONSTRAINT "examination_scores_examination_id_fkey"
    FOREIGN KEY ("examination_id") REFERENCES "examinations"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examination_scores"
    ADD CONSTRAINT "examination_scores_student_id_fkey"
    FOREIGN KEY ("student_id") REFERENCES "students"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
