/*
  Warnings:

  - You are about to drop the column `dashboard_id` on the `standards` table. All the data in the column will be lost.
  - Made the column `dashboard_id` on table `questions` required. The migration will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "standards" DROP CONSTRAINT "standards_dashboard_id_fkey";

-- DropIndex
DROP INDEX "questions_dashboard_id_unique";

-- DropIndex
DROP INDEX "responses_dashboard_id_unique";

-- DropIndex
DROP INDEX "standards_dashboard_id_unique";

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "dashboard_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "standards" DROP COLUMN "dashboard_id";
