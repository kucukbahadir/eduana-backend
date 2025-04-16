/*
  Warnings:

  - The primary key for the `Announcement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Announcement` table. All the data in the column will be lost.
  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `notes` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `present` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Attendance` table. All the data in the column will be lost.
  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Class` table. All the data in the column will be lost.
  - The primary key for the `Curriculum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Curriculum` table. All the data in the column will be lost.
  - You are about to drop the column `field` on the `Curriculum` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Curriculum` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Curriculum` table. All the data in the column will be lost.
  - The primary key for the `Enrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Enrollment` table. All the data in the column will be lost.
  - The primary key for the `ExternalStudentAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `password` on the `ExternalStudentAccount` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `ExternalStudentAccount` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `ExternalStudentAccount` table. All the data in the column will be lost.
  - The primary key for the `FinalEvaluation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `analyticalIntelligence` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `creativity` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `distractabilityLevel` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `evaluationId` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `handsOnAptitude` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `leadershipSkills` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `learningInterest` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `listeningSkills` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `participation` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `presentationSkills` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `problemSolvingAbility` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `programmingAptitude` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `roboticsCodingAptitude` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `ruleAdherence` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `socialInteraction` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `teamworkAdaptability` on the `FinalEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `workSatisfaction` on the `FinalEvaluation` table. All the data in the column will be lost.
  - The primary key for the `Kahoot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lessonId` on the `Kahoot` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Kahoot` table. All the data in the column will be lost.
  - The primary key for the `Keyword` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `definition` on the `Keyword` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Keyword` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Keyword` table. All the data in the column will be lost.
  - The primary key for the `Lesson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `curriculumId` on the `Lesson` table. All the data in the column will be lost.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `activityId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `end` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Session` table. All the data in the column will be lost.
  - The primary key for the `SessionEvaluation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `active` on the `SessionEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `adherence` on the `SessionEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `completion` on the `SessionEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `creativity` on the `SessionEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `evaluationId` on the `SessionEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `independent` on the `SessionEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `SessionEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `persistency` on the `SessionEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `SessionEvaluation` table. All the data in the column will be lost.
  - The primary key for the `Teaching` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `Teaching` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Teaching` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Teaching` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coordinator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PresentationSlide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentParent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[value]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `message` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Attendance` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `session_id` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty_level` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `program_type` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Enrollment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credentials` to the `ExternalStudentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_name` to the `ExternalStudentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `ExternalStudentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ExternalStudentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metrics` to the `FinalEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proficiency` to the `FinalEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FinalEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FinalEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lesson_id` to the `Kahoot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Kahoot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Keyword` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Keyword` table without a default value. This is not possible if the table is not empty.
  - Added the required column `curriculum_id` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lesson_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feedback` to the `SessionEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lesson_id` to the `SessionEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `SessionEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `SessionEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SessionEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `SessionEvaluation` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Teaching` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `session_id` to the `Teaching` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Teaching` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Teaching` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'COORDINATOR');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED', 'LATE');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_classId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Coordinator" DROP CONSTRAINT "Coordinator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_classId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_classId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ExternalStudentAccount" DROP CONSTRAINT "ExternalStudentAccount_studentId_fkey";

-- DropForeignKey
ALTER TABLE "FinalEvaluation" DROP CONSTRAINT "FinalEvaluation_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "Kahoot" DROP CONSTRAINT "Kahoot_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Keyword" DROP CONSTRAINT "Keyword_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_curriculumId_fkey";

-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_userId_fkey";

-- DropForeignKey
ALTER TABLE "PresentationSlide" DROP CONSTRAINT "PresentationSlide_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_classId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "SessionEvaluation" DROP CONSTRAINT "SessionEvaluation_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "SessionEvaluation" DROP CONSTRAINT "SessionEvaluation_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudentParent" DROP CONSTRAINT "StudentParent_parentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentParent" DROP CONSTRAINT "StudentParent_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teaching" DROP CONSTRAINT "Teaching_classId_fkey";

-- DropForeignKey
ALTER TABLE "Teaching" DROP CONSTRAINT "Teaching_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Teaching" DROP CONSTRAINT "Teaching_teacherId_fkey";

-- DropIndex
DROP INDEX "FinalEvaluation_evaluationId_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_pkey",
DROP COLUMN "classId",
DROP COLUMN "content",
DROP COLUMN "createdAt",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "author_id" TEXT,
ADD COLUMN     "class_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "location_id" TEXT,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Announcement_id_seq";

-- AlterTable
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pkey",
DROP COLUMN "notes",
DROP COLUMN "present",
DROP COLUMN "sessionId",
DROP COLUMN "studentId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "status" "AttendanceStatus" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "timestamp" DROP DEFAULT,
ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "curriculum_id" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "location_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Class_id_seq";

-- AlterTable
ALTER TABLE "Curriculum" DROP CONSTRAINT "Curriculum_pkey",
DROP COLUMN "description",
DROP COLUMN "field",
DROP COLUMN "level",
DROP COLUMN "type",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "difficulty_level" TEXT NOT NULL,
ADD COLUMN     "program_type" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Curriculum_id_seq";

-- AlterTable
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_pkey",
DROP COLUMN "classId",
DROP COLUMN "studentId",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ExternalStudentAccount" DROP CONSTRAINT "ExternalStudentAccount_pkey",
DROP COLUMN "password",
DROP COLUMN "studentId",
DROP COLUMN "username",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "credentials" TEXT NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "platform_name" TEXT NOT NULL,
ADD COLUMN     "student_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ExternalStudentAccount_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ExternalStudentAccount_id_seq";

-- AlterTable
ALTER TABLE "FinalEvaluation" DROP CONSTRAINT "FinalEvaluation_pkey",
DROP COLUMN "analyticalIntelligence",
DROP COLUMN "creativity",
DROP COLUMN "distractabilityLevel",
DROP COLUMN "evaluationId",
DROP COLUMN "handsOnAptitude",
DROP COLUMN "leadershipSkills",
DROP COLUMN "learningInterest",
DROP COLUMN "level",
DROP COLUMN "listeningSkills",
DROP COLUMN "notes",
DROP COLUMN "participation",
DROP COLUMN "presentationSkills",
DROP COLUMN "problemSolvingAbility",
DROP COLUMN "programmingAptitude",
DROP COLUMN "roboticsCodingAptitude",
DROP COLUMN "ruleAdherence",
DROP COLUMN "socialInteraction",
DROP COLUMN "teamworkAdaptability",
DROP COLUMN "workSatisfaction",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "evaluator_id" TEXT,
ADD COLUMN     "metrics" JSONB NOT NULL,
ADD COLUMN     "proficiency" "ProficiencyLevel" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FinalEvaluation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FinalEvaluation_id_seq";

-- AlterTable
ALTER TABLE "Kahoot" DROP CONSTRAINT "Kahoot_pkey",
DROP COLUMN "lessonId",
DROP COLUMN "type",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "lesson_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Kahoot_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Kahoot_id_seq";

-- AlterTable
ALTER TABLE "Keyword" DROP CONSTRAINT "Keyword_pkey",
DROP COLUMN "definition",
DROP COLUMN "lessonId",
DROP COLUMN "name",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Keyword_id_seq";

-- AlterTable
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_pkey",
DROP COLUMN "curriculumId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "curriculum_id" TEXT NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Lesson_id_seq";

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "activityId",
DROP COLUMN "classId",
DROP COLUMN "end",
DROP COLUMN "lessonId",
DROP COLUMN "start",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lesson_id" TEXT NOT NULL,
ADD COLUMN     "location_id" TEXT,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Session_id_seq";

-- AlterTable
ALTER TABLE "SessionEvaluation" DROP CONSTRAINT "SessionEvaluation_pkey",
DROP COLUMN "active",
DROP COLUMN "adherence",
DROP COLUMN "completion",
DROP COLUMN "creativity",
DROP COLUMN "evaluationId",
DROP COLUMN "independent",
DROP COLUMN "notes",
DROP COLUMN "persistency",
DROP COLUMN "sessionId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "feedback" TEXT NOT NULL,
ADD COLUMN     "lesson_id" TEXT NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SessionEvaluation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SessionEvaluation_id_seq";

-- AlterTable
ALTER TABLE "Teaching" DROP CONSTRAINT "Teaching_pkey",
DROP COLUMN "classId",
DROP COLUMN "sessionId",
DROP COLUMN "teacherId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "Teaching_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry",
DROP COLUMN "updatedAt",
DROP COLUMN "username",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "diet_restrictions" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "language_preference" TEXT,
ADD COLUMN     "location_id" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Coordinator";

-- DropTable
DROP TABLE "Evaluation";

-- DropTable
DROP TABLE "Parent";

-- DropTable
DROP TABLE "PresentationSlide";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "StudentParent";

-- DropTable
DROP TABLE "Teacher";

-- DropEnum
DROP TYPE "Absence";

-- DropEnum
DROP TYPE "Adherence";

-- DropEnum
DROP TYPE "Completion";

-- DropEnum
DROP TYPE "Creativity";

-- DropEnum
DROP TYPE "Independent";

-- DropEnum
DROP TYPE "Level";

-- DropEnum
DROP TYPE "Persistency";

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "PresentationSlides" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PresentationSlides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonKeyword" (
    "lesson_id" TEXT NOT NULL,
    "keyword_id" TEXT NOT NULL,

    CONSTRAINT "LessonKeyword_pkey" PRIMARY KEY ("lesson_id","keyword_id")
);

-- CreateTable
CREATE TABLE "ParentAccount" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ParentAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamificationPoints" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "awarded_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "GamificationPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_value_key" ON "Keyword"("value");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "Curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teaching" ADD CONSTRAINT "Teaching_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teaching" ADD CONSTRAINT "Teaching_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEvaluation" ADD CONSTRAINT "SessionEvaluation_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEvaluation" ADD CONSTRAINT "SessionEvaluation_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEvaluation" ADD CONSTRAINT "SessionEvaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalEvaluation" ADD CONSTRAINT "FinalEvaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalEvaluation" ADD CONSTRAINT "FinalEvaluation_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresentationSlides" ADD CONSTRAINT "PresentationSlides_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kahoot" ADD CONSTRAINT "Kahoot_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonKeyword" ADD CONSTRAINT "LessonKeyword_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonKeyword" ADD CONSTRAINT "LessonKeyword_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "Keyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentAccount" ADD CONSTRAINT "ParentAccount_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentAccount" ADD CONSTRAINT "ParentAccount_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalStudentAccount" ADD CONSTRAINT "ExternalStudentAccount_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamificationPoints" ADD CONSTRAINT "GamificationPoints_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
