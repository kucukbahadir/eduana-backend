const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TeacherService {
  /**
   * Creates a new teacher profile in the database
   * @async
   * @param {string} email - The teacher's email address
   * @param {string} phoneNumber - The teacher's phone number
   * @param {string|number} userId - The user ID associated with the teacher
   * @returns {Promise<void>} A promise that resolves when the teacher profile is created
   * @throws {Error} If there is a problem creating the teacher profile
   */
  async createTeacherProfile(email, phoneNumber, userId) {
    await prisma.teacher.create({
      data: {
        email, 
        phoneNumber, 
        userId
      }
    })
  }

  /**
   * Finds a teacher by their ID.
   * @async
   * @param {string} teacherId - The ID of the teacher to find.
   * @returns {Promise<Object|null>} The teacher object if found, null otherwise.
   * @throws {Error} If a database error occurs.
   */
  async findById(teacherId) {
    return await prisma.teacher.findUnique({
      where: { id: teacherId }
    })
  }

  async getClassesByTeacherId(teacherId) {
    const teachings = await prisma.teaching.findMany({
      where: { teacherId },
      include: { 
        class: {
          include: {
            sessions: true,
            evaluations: true,
            announcements: true,
            enrollments: true,
            teachings: true
          }
        } 
      }
    })

    return teachings.map(teaching => teaching.class);
  }
}

module.exports = new TeacherService();