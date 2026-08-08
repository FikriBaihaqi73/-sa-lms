/*
  Warnings:

  - You are about to drop the column `email` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Users_email_idx";

-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "email",
DROP COLUMN "full_name",
DROP COLUMN "password_hash",
ADD COLUMN     "last_login" TIMESTAMP,
ADD COLUMN     "password" VARCHAR NOT NULL,
ADD COLUMN     "role_id" UUID NOT NULL,
ADD COLUMN     "username" VARCHAR NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE INDEX "Users_role_id_idx" ON "Users"("role_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
