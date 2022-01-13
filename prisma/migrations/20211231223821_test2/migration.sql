/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[dashboard_id]` on the table `questions`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[dashboard_id]` on the table `responses`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[dashboard_id]` on the table `standards`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "dashboard_id" INTEGER;

-- AlterTable
ALTER TABLE "responses" ADD COLUMN     "dashboard_id" INTEGER,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "standards" ADD COLUMN     "dashboard_id" INTEGER;

-- CreateTable
CREATE TABLE "dashboard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "questions_dashboard_id_unique" ON "questions"("dashboard_id");

-- CreateIndex
CREATE UNIQUE INDEX "responses_dashboard_id_unique" ON "responses"("dashboard_id");

-- CreateIndex
CREATE UNIQUE INDEX "standards_dashboard_id_unique" ON "standards"("dashboard_id");

-- AddForeignKey
ALTER TABLE "dashboard" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standards" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
