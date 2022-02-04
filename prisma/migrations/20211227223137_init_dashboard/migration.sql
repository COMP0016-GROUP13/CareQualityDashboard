/*
  Warnings:

  - Added the required column `dashboard_id` to the `question_urls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dashboard_id` to the `responses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_urls" ADD COLUMN     "dashboard_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "dashboard_id" INTEGER;

-- AlterTable
ALTER TABLE "responses" ADD COLUMN     "dashboard_id" INTEGER NOT NULL,
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

-- AddForeignKey
ALTER TABLE "dashboard" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_urls" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standards" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
