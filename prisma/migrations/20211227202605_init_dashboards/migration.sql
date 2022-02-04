/*
  Warnings:

  - You are about to drop the `feedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_department_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_user_id_fkey";

-- DropIndex
DROP INDEX "department_join_codes_department_id_unique";

-- DropIndex
DROP INDEX "clinician_join_codes_department_id_unique";

-- AlterTable
ALTER TABLE "responses" ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "feedback";
