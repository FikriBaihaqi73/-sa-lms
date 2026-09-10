/*
  Warnings:

  - You are about to drop the column `role_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.
  - Added the required column `role_id` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_role_id_fkey";

-- DropForeignKey
ALTER TABLE "institutions" DROP CONSTRAINT "institutions_institution_level_id_fkey";

-- DropIndex
DROP INDEX "Users_role_id_idx";

-- DropIndex
DROP INDEX "Users_username_key";

-- DropIndex
DROP INDEX "profiles_user_id_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "role_id",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "institutions" ALTER COLUMN "institution_level_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "role_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "profiles_role_id_idx" ON "profiles"("role_id");

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_institution_level_id_fkey" FOREIGN KEY ("institution_level_id") REFERENCES "InstitutionLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
