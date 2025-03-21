/*
  Warnings:

  - You are about to drop the column `password` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Coordinator` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `ExternalStudentAccount` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `loginCode` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Teacher` table. All the data in the column will be lost.
  - The `resetTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_loginCode_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Coordinator" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "ExternalStudentAccount" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "loginCode";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
DROP COLUMN "resetTokenExpiry",
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
