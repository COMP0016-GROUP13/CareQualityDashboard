/*
  Warnings:

  - Added the required column `department_id` to the `dashboard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dashboard" ADD COLUMN     "department_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "dashboard" ADD FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
