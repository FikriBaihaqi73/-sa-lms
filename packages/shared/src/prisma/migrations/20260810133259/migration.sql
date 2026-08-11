-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "department_id" UUID,
    "academic_status_id" UUID NOT NULL,
    "student_number" TEXT NOT NULL,
    "enrollment_year" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_profile_id_key" ON "students"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_student_number_key" ON "students"("student_number");
