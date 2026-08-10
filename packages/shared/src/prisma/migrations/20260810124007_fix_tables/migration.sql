/*
  Warnings:

  - The primary key for the `employment_status` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `nationalities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `employment_status` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `nationalities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "employment_status" DROP CONSTRAINT "employment_status_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "employment_status_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "nationalities" DROP CONSTRAINT "nationalities_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "nationalities_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "identity_number" VARCHAR(255),
    "gender" VARCHAR(50),
    "birth_place" VARCHAR(255),
    "birth_date" DATE,
    "religion_id" UUID,
    "nationality_id" UUID,
    "address" TEXT,
    "phone_number" VARCHAR(255),
    "email" VARCHAR(255),
    "photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "religions" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "religions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teachers" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "department_id" UUID,
    "specialization_id" UUID,
    "employment_status_id" UUID,
    "teacher_number" VARCHAR NOT NULL,
    "join_date" DATE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "Teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "religions_name_key" ON "religions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Teachers_profile_id_key" ON "Teachers"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teachers_teacher_number_key" ON "Teachers"("teacher_number");

-- CreateIndex
CREATE INDEX "Teachers_department_id_idx" ON "Teachers"("department_id");

-- CreateIndex
CREATE INDEX "Teachers_specialization_id_idx" ON "Teachers"("specialization_id");

-- CreateIndex
CREATE INDEX "Teachers_employment_status_id_idx" ON "Teachers"("employment_status_id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_religion_id_fkey" FOREIGN KEY ("religion_id") REFERENCES "religions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "nationalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_employment_status_id_fkey" FOREIGN KEY ("employment_status_id") REFERENCES "employment_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
