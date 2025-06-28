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

  async getClassById(classId) {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      select: {
        id: true,
        name: true,
        curriculum: {
          select: {
            id: true,
            title: true,
            program_type: true,
            difficulty_level: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        enrollments: {
          select: {
            user: {
              select: {
                id: true,
                full_name: true,
                age: true,
                language_preference: true,
                diet_restrictions: true,
                experience: true,
                remarks: true,
                parent_phone_number: true,
              },
            },
          },
        },
        sessions: {
          select: {
            id: true,
            start_time: true,
            end_time: true,
            lesson: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return classData;
  }

  async getClassesByTeacherId(teacherId) {
    const classes = await prisma.teaching.findMany({
      where: { user_id: teacherId },
      select: {
        session: {
          select: {
            class: {
              select: {
                id: true,
                name: true,
                curriculum: {
                  select: {
                    id: true,
                    title: true,
                    program_type: true,
                    difficulty_level: true,
                  },
                },
                location: {
                  select: {
                    id: true,
                    name: true,
                    address: true,
                  },
                },
                sessions: {
                  select: {
                    id: true,
                    start_time: true,
                    end_time: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const uniqueClasses = Array.from(new Map(classes.map((teaching) => [teaching.session.class.id, teaching.session.class])).values());

    return uniqueClasses;
  }
}

module.exports = new ClassService();
