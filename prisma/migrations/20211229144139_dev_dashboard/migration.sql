/*
  Warnings:

  - You are about to drop the column `dashboard_id` on the `question_urls` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[dashboard_id]` on the table `questions`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[dashboard_id]` on the table `responses`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[dashboard_id]` on the table `standards`. If there are existing duplicate values, the migration will fail.

*/
-- DropForeignKey
ALTER TABLE "question_urls" DROP CONSTRAINT "question_urls_dashboard_id_fkey";

-- AlterTable
ALTER TABLE "question_urls" DROP COLUMN "dashboard_id";

-- AlterTable
ALTER TABLE "responses" ALTER COLUMN "dashboard_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "questions_dashboard_id_unique" ON "questions"("dashboard_id");

-- CreateIndex
CREATE UNIQUE INDEX "responses_dashboard_id_unique" ON "responses"("dashboard_id");

-- CreateIndex
CREATE UNIQUE INDEX "standards_dashboard_id_unique" ON "standards"("dashboard_id");
