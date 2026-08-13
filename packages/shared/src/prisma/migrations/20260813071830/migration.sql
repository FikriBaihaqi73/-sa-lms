-- CreateTable
CREATE TABLE "study_results" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "total_credits" INTEGER,
    "semester_gpa" DECIMAL(4,2),
    "cumulative_gpa" DECIMAL(4,2),
    "academic_status_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "study_results_student_id_academic_year_id_semester_id_key" ON "study_results"("student_id", "academic_year_id", "semester_id");

-- AddForeignKey
ALTER TABLE "study_results" ADD CONSTRAINT "study_results_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_results" ADD CONSTRAINT "study_results_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_results" ADD CONSTRAINT "study_results_academic_status_id_fkey" FOREIGN KEY ("academic_status_id") REFERENCES "AcademicStatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
