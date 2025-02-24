/*
  Warnings:
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without a primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
*/

-- Create Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'COORDINATOR');
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE');

-- Remove Foreign Key Constraints
ALTER TABLE "Class" DROP CONSTRAINT IF EXISTS "Class_teacherId_fkey";
ALTER TABLE "Lesson" DROP CONSTRAINT IF EXISTS "Lesson_teacherId_fkey";
ALTER TABLE "Attendance" DROP CONSTRAINT IF EXISTS "Attendance_studentId_fkey";

-- AlterTable: Change `User.id` to TEXT
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE TEXT;

-- AlterTable: Modify `User` table
ALTER TABLE "User"
DROP CONSTRAINT IF EXISTS "User_pkey",
    DROP COLUMN IF EXISTS "name",
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "password" TEXT NOT NULL,
    ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'STUDENT',
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "username" TEXT NOT NULL UNIQUE;

-- Re-add Primary Key
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- Create Tables
CREATE TABLE "Class" (
                         "id" TEXT NOT NULL,
                         "name" TEXT NOT NULL,
                         "teacherId" TEXT,
                         "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lesson" (
                          "id" TEXT NOT NULL,
                          "title" TEXT NOT NULL,
                          "description" TEXT NOT NULL,
                          "classId" TEXT NOT NULL,
                          "teacherId" TEXT,
                          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Attendance" (
                              "id" TEXT NOT NULL,
                              "lessonId" TEXT NOT NULL,
                              "studentId" TEXT NOT NULL,
                              "status" "AttendanceStatus" NOT NULL,
                              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Announcement" (
                                "id" TEXT NOT NULL,
                                "title" TEXT NOT NULL,
                                "message" TEXT NOT NULL,
                                "classId" TEXT,
                                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_StudentClasses" (
                                   "A" TEXT NOT NULL,
                                   "B" TEXT NOT NULL,
                                   CONSTRAINT "_StudentClasses_AB_pkey" PRIMARY KEY ("A", "B")
);

-- Create Indexes
CREATE UNIQUE INDEX "Class_name_key" ON "Class" ("name");
CREATE INDEX "_StudentClasses_B_index" ON "_StudentClasses" ("B");
CREATE UNIQUE INDEX "User_username_key" ON "User" ("username");

-- Re-add Foreign Key Constraints
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "_StudentClasses" ADD CONSTRAINT "_StudentClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_StudentClasses" ADD CONSTRAINT "_StudentClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
