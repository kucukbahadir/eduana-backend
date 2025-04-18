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
        const now = new Date();

        const nextLesson = await prisma.session.findFirst({
            where: {
                teachings: {
                    some: { teacherId }, // Teacher must be assigned
                },
                start: {
                    gte: now, // Only future sessions
                },
            },
            orderBy: {
                start: "asc", // Soonest first
            },
            select: {
                id: true,
                start: true,
                end: true,
                class: {
                    select: {
                        title: true,
                    },
                },
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        curriculum: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
        });

        return nextLesson;
    }
}


module.exports = new LessonService();
