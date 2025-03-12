const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class StudentService {
    async getStudentsByClassId(classId) {
        try {
            const students = await prisma.user.findMany({
                where: {classId},
                include: {class: true} // Optional: Include class details
            });

            return students;
        } catch (error) {
            console.error('Error fetching students:', error);
            throw new Error('Database error while fetching students');
        }
    }

    async getStudentsByTeacherId(teacherId) {
        try {
            const students = await prisma.user.findMany({
                where: {teacherId},
                include: {teacher: true}
            });

            return students
        } catch (error) {
            console.error('Error fetching students:', error);
            throw new Error('Database error while fetching students');
        }
    }
}

module.exports = new StudentService();
