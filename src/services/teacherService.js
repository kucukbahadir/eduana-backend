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
   * 
   * @async
   * @param {string|number} teacherId - The ID of the teacher to find.
   * @returns {Promise<Object>} The teacher object with user data included.
   * @throws {Error} If the teacher cannot be found or another error occurs.
   */
  async findById(teacherId) {
    return await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { user: true }
    });
  }


  /**
   * Retrieves all students taught by a specific teacher.
   * 
   * @async
   * @param {number|string} teacherId - The ID of the teacher whose students are being retrieved
   * @returns {Promise<Array>} A promise that resolves to an array of student objects with their associated user data
   * 
   * @description
   * This function:
   * 1. Finds all teaching records associated with the teacher
   * 2. Extracts all class IDs the teacher teaches
   * 3. Queries all students enrolled in those classes
   * 4. Returns distinct student records with their user information
   */
  async getStudents(teacherId) {
    const teachings = await prisma.teaching.findMany({
      where: { teacherId },
      include: {
        session: {
          select: {
            classId: true
          }
        }
      }
    });
    
    // Extract all class IDs the teacher teaches
    const classIds = teachings
      .map(teaching => teaching.session.classId)
      .filter(Boolean); // Remove any null/undefined values
    
    const students = await prisma.student.findMany({
      where: {
        enrollments: {
          some: {
            classId: {
              in: classIds
            }
          }
        }
      },
      include: {
        user: true
      },
      distinct: ['id']
    });
    
    return students;
  }
}

module.exports = new TeacherService();