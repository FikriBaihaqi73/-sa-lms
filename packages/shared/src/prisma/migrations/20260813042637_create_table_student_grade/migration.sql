/*
  Warnings:

  - You are about to alter the column `title` on the `examinations` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "examinations" DROP CONSTRAINT "examinations_assignment_type_id_fkey";

-- DropForeignKey
ALTER TABLE "examinations" DROP CONSTRAINT "examinations_class_subject_id_fkey";

-- AlterTable
ALTER TABLE "examinations" ALTER COLUMN "class_subject_id" DROP NOT NULL,
ALTER COLUMN "assignment_type_id" DROP NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "student_grades" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "class_subject_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "assignment_score" DECIMAL(5,2),
    "quiz_score" DECIMAL(5,2),
    "mid_exam_score" DECIMAL(5,2),
    "final_exam_score" DECIMAL(5,2),
    "final_score" DECIMAL(5,2),
    "grade_id" UUID,
    "remarks" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "student_grades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_grades_student_id_class_subject_id_academic_year_id_key" ON "student_grades"("student_id", "class_subject_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "examination_scores_graded_by_idx" ON "examination_scores"("graded_by");

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_class_subject_id_fkey" FOREIGN KEY ("class_subject_id") REFERENCES "class_subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_assignment_type_id_fkey" FOREIGN KEY ("assignment_type_id") REFERENCES "AssignmentTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examination_scores" ADD CONSTRAINT "examination_scores_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_grades" ADD CONSTRAINT "student_grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_grades" ADD CONSTRAINT "student_grades_class_subject_id_fkey" FOREIGN KEY ("class_subject_id") REFERENCES "class_subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_grades" ADD CONSTRAINT "student_grades_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_grades" ADD CONSTRAINT "student_grades_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
