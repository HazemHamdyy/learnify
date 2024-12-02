/*
  Warnings:

  - You are about to drop the column `user_id` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[enrollment_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- DropIndex
DROP INDEX "payments_user_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "user_id",
ADD COLUMN     "enrollment_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "payments_enrollment_id_key" ON "payments"("enrollment_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
