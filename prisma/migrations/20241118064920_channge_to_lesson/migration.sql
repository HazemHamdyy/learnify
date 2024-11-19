/*
  Warnings:

  - You are about to drop the column `course_content_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the `course_contents` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[course_id,section_number]` on the table `sections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lesson_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_course_content_id_fkey";

-- DropForeignKey
ALTER TABLE "course_contents" DROP CONSTRAINT "course_contents_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_contents" DROP CONSTRAINT "course_contents_section_id_fkey";

-- DropForeignKey
ALTER TABLE "interests" DROP CONSTRAINT "interests_category_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "course_content_id",
ADD COLUMN     "lesson_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "imageUrl",
ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "enrollments" ALTER COLUMN "enrollment_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "expiry_date" DROP NOT NULL;

-- DropTable
DROP TABLE "course_contents";

-- CreateTable
CREATE TABLE "lessons" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "content_type" "ContentType" NOT NULL,
    "duration_in_minutes" DOUBLE PRECISION NOT NULL,
    "content_file_link" TEXT NOT NULL,
    "is_free" BOOLEAN NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sections_course_id_section_number_key" ON "sections"("course_id", "section_number");

-- AddForeignKey
ALTER TABLE "interests" ADD CONSTRAINT "interests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
