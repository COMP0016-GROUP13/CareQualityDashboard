/*
  Warnings:

  - Added the required column `dashboard_id` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "dashboard_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "responses" ADD COLUMN     "dashboard_id" INTEGER,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP(3);

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
ALTER TABLE "questions" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
