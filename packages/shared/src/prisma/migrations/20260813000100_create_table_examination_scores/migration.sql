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