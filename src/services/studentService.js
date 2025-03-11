const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class StudentService {
    async getStudentsByClassId(classId) {
        try {
            return await prisma.student.findMany({
                where: {classId},
                include: {class: true} // Optional: Include class details
            });
        } catch (error) {
            console.error('Error fetching students:', error);
            throw new Error('Database error while fetching students');
        }
    }
}


module.exports = new StudentService();