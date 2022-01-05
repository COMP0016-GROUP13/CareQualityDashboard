/*
  Warnings:

  - Made the column `dashboard_id` on table `questions` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "dashboard_id" SET NOT NULL;
