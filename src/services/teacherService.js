const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TeacherService {
    async getClassesByTeacherId(teacherId) {
        try {
            const classes = await prisma.class.findMany({
                where: { teacherId },
                include: { class: true } // Optional: Include class details
            });

            return classes;
        } catch (error) {
            console.error('Error fetching classes:', error);
            throw new Error('Database error while fetching classes');
        }
    }
}

module.exports = new TeacherService();