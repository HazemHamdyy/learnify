/*
  Warnings:

  - You are about to drop the column `comment_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `enrollments` table. All the data in the column will be lost.
  - Added the required column `lesson_number` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_comment_id_fkey";

-- DropIndex
DROP INDEX "enrollments_paymentId_key";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "comment_id",
ADD COLUMN     "parent_comment_id" INTEGER;

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "paymentId";

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "lesson_number" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
