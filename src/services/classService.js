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
    try {
      const students = await prisma.enrollment.findMany({
        where: {classId},
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      return students.map(({student}) => {
        const {user, ...studentDetails} = student;
        return {
          ...user,
          studentDetails,
        };
      });
    } catch (error) {
      console.error("Error fetching students by classId:", error);
      throw new Error("Failed to retrieve students for the class.");
    }
  }
}

  module.exports = new ClassService();
