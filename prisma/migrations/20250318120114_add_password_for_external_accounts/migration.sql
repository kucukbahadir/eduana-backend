/*
  Warnings:

  - Added the required column `password` to the `ExternalStudentAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExternalStudentAccount" ADD COLUMN     "password" TEXT NOT NULL;
