const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ClassService {
  /**
   * Retrieves all students enrolled in a specific class.
   * 
   * @async
   * @param {number} classId - The ID of the class to retrieve students for.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of student objects.
   *                                  Each object contains user information merged with student details.
   * @throws {Error} If the database query fails or if there are issues parsing the class ID.
   */
  async getStudentsByClassId(classId) {
    const students = await prisma.enrollment.findMany({
      where: { classId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    // Transform the result to return user data with student details
    const formattedStudents = students.map((enrollment) => {
      const { user, ...studentDetails } = enrollment.student;
      return {
        ...user,
        studentDetails,
      };
    });

    return formattedStudents;
  }
}

module.exports = new ClassService();
