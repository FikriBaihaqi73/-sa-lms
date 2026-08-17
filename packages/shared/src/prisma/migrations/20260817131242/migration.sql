/*
  Warnings:

  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `ActivityLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `class_students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `class_subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `role_permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `student_guardians` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `subject_prerequisites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_role_id_fkey";

-- AlterTable
ALTER TABLE "AcademicStatuses" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "ActivityLogs" ADD COLUMN     "deleted_at" TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "AssignmentTypes" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "Attendances" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "deleted_at" TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "InstitutionLevel" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "deleted_at" TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "TeachingJournals" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "academic_years" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "assignment_submissions" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "class_announcements" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "class_students" ADD COLUMN     "deleted_at" TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "class_subjects" ADD COLUMN     "deleted_at" TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "employment_status" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "examination_scores" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "grades" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "guardians" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "module_contents" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "nationalities" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "religions" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "role_permissions" ADD COLUMN     "deleted_at" TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "semesters" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "specializations" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "student_grades" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "student_guardians" ADD COLUMN     "deleted_at" TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "study_plans" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "study_results" ADD COLUMN     "deleted_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "subject_prerequisites" ADD COLUMN     "deleted_at" TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL;

-- DropTable
DROP TABLE "Roles";

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
