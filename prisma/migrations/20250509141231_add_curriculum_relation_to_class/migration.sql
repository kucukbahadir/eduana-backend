-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "curriculumId" INTEGER;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;
