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
  /**
   * Retrieves all classes with their associated teachers.
   * @returns {Promise<Array>} List of classes with teacher information.
   */
  async getAll() {
    return await prisma.class.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });
  }
  /**
   * Creates a new class with the provided data.
   * @param {Object} data - Class data to create.
   * @returns {Promise<Object>} The created class object.
   */
  async create(data) {
    return await prisma.class.create({
      data: {
        title: data.title,
        description: data.description,
        teacher_id: data.teacher_id,
      },
    });
  }
  /**
   * Updates an existing class by ID with the provided data.
   * @param {number} id - The ID of the class to update.
   * @param {Object} data - Class data to update.
   * @returns {Promise<Object>} The updated class object.
   */
  async update(id, data) {
    return await prisma.class.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        teacher_id: data.teacher_id,
      },
    });
  }
  /**
   * Deletes a class by ID.
   * @param {number} id - The ID of the class to delete.
   * @returns {Promise<Object>} The deleted class object.
   */
  async delete(id) {
    return await prisma.class.delete({
      where: { id: parseInt(id) },
    });
  }


}

module.exports = new ClassService();
