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

  async getLessonById(lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        description: true,
        curriculum: {
          select: {
            id: true,
            title: true,
            program_type: true,
            difficulty_level: true,
          },
        },
        keywords: {
          select: {
            keyword: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        learning_objectives: {
          select: {
            id: true,
            objective: true,
            descriptions: true,
          },
        },
        resources: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
      },
    });

    return lesson;
  }
}

module.exports = new LessonService();
