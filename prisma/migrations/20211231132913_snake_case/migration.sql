/*
  Warnings:

  - You are about to drop the column `dashboard_id` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `dashboard_id` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `dashboard_id` on the `standards` table. All the data in the column will be lost.
  - You are about to drop the `dashboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashboard" DROP CONSTRAINT "dashboard_user_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_dashboard_id_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_dashboard_id_fkey";

-- DropForeignKey
ALTER TABLE "standards" DROP CONSTRAINT "standards_dashboard_id_fkey";

-- DropIndex
DROP INDEX "questions_dashboard_id_unique";

-- DropIndex
DROP INDEX "responses_dashboard_id_unique";

-- DropIndex
DROP INDEX "standards_dashboard_id_unique";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "dashboard_id";

-- AlterTable
ALTER TABLE "responses" DROP COLUMN "dashboard_id",
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "standards" DROP COLUMN "dashboard_id";

-- DropTable
DROP TABLE "dashboard";
