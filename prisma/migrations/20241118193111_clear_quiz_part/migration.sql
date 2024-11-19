/*
  Warnings:

  - You are about to drop the column `comment_type` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `enrollment_date` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quizzes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_quizzes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_reacts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkoutSessionId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_course_id_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_section_id_fkey";

-- DropForeignKey
ALTER TABLE "user_answers" DROP CONSTRAINT "user_answers_question_id_fkey";

-- DropForeignKey
ALTER TABLE "user_answers" DROP CONSTRAINT "user_answers_student_id_fkey";

-- DropForeignKey
ALTER TABLE "user_quizzes" DROP CONSTRAINT "user_quizzes_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "user_quizzes" DROP CONSTRAINT "user_quizzes_student_id_fkey";

-- DropForeignKey
ALTER TABLE "user_reacts" DROP CONSTRAINT "user_reacts_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "user_reacts" DROP CONSTRAINT "user_reacts_user_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "comment_type",
DROP COLUMN "dislikes",
DROP COLUMN "likes",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "lesson_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "enrollment_date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentMethod",
ADD COLUMN     "checkoutSessionId" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "payment_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "questions";

-- DropTable
DROP TABLE "quizzes";

-- DropTable
DROP TABLE "user_answers";

-- DropTable
DROP TABLE "user_quizzes";

-- DropTable
DROP TABLE "user_reacts";

-- DropEnum
DROP TYPE "CommentType";

-- DropEnum
DROP TYPE "QuestionType";

-- DropEnum
DROP TYPE "QuizStatus";

-- DropEnum
DROP TYPE "QuizType";

-- DropEnum
DROP TYPE "ReactType";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
