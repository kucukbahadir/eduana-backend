const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class LessonService {
    /**
     * Fetches the next scheduled lesson for a teacher.
     *
     * @param {number} teacherId - ID of the authenticated teacher
     * @returns {Promise<Object|null>} - Returns next lesson details or null if not found
     */
    async getNextLesson(teacherId) {
        return prisma.session.findFirst({
            where: {
                teachings: {
                    some: {teacherId: teacherId}, // Only sessions where this teacher is teaching
                },
                start: {gte: new Date()}, // Future sessions only
            },
            orderBy: {start: "asc"}, // Get the nearest upcoming session
            select: {
                id: true,
                start: true,
                end: true,
                class: {
                    select: {title: true},
                },
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        curriculum: {
                            select: {title: true},
                        },
                    },
                },
            },
        });
    }
}


module.exports = new LessonService();
