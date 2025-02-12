-- Create Enum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'COORDINATOR');

-- Create Tables
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(50) UNIQUE NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "RoleType" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT NOW()
);

CREATE TABLE "Class" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "teacherId" INT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("teacherId") REFERENCES "User"("id")
);

CREATE TABLE "Announcement" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "classId" INT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("classId") REFERENCES "Class"("id")
);

CREATE TABLE "Lesson" (
    "id" SERIAL PRIMARY KEY,
    "classId" INT,
    "teacherId" INT,
    "scheduledTime" TIMESTAMP(0) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("classId") REFERENCES "Class"("id"),
    FOREIGN KEY ("teacherId") REFERENCES "User"("id")
);

CREATE TABLE "Attendance" (
    "id" SERIAL PRIMARY KEY,
    "lessonId" INT,
    "studentId" INT,
    "present" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id"),
    FOREIGN KEY ("studentId") REFERENCES "User"("id"),
    UNIQUE ("lessonId", "studentId")
);
