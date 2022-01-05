/*
  Warnings:

  - You are about to drop the column `dashboard_id` on the `standards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "standards" DROP CONSTRAINT "standards_dashboard_id_fkey";

-- AlterTable
ALTER TABLE "standards" DROP COLUMN "dashboard_id";
