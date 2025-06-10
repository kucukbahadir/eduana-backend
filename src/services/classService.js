const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ClassService {
  /**
   * Lists students in the teacher’s class.
   * @param {string} [classId] - Optional class ID to filter students.
   * @returns {Promise<Array>} List of students.
   */
  async getStudentsByClassId(classId) {
    const whereClause = {
      role: "STUDENT",
      ...(classId && { enrollments: { some: { class_id: classId } } }),
    };

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        full_name: true,
        enrollments: {
          select: {
            class: {
              select: {
                id: true,
                title: true, // Assuming Class model has a 'title' field for class name
              },
            },
          },
        },
      },
    });

    return students.map((student) => ({
      studentId: student.id,
      name: student.full_name,
      // If a student can be in multiple classes, you might need to adjust how 'class' is represented.
      // Here, we take the title of the first enrolled class found.
      class: student.enrollments[0]?.class?.title || null,
    }));
  }

}

module.exports = new ClassService();
