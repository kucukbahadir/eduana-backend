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
        userId,
      },
    });
  }

  /**
   * Retrieves a teacher by their ID, including associated user information.
   *
   * @async
   * @param {string|number} teacherId - The unique identifier of the teacher to find
   * @returns {Promise<Object|null>} The teacher object with included user data if found, null otherwise
   * @throws {Error} If there's a database error during the operation
   */
  async findById(teacherId) {
    return await prisma.teacher.findUnique({
      where: {id: teacherId},
      include: {user: true},
    });
  }

  /**
   * Retrieves all classes taught by a specific teacher.
   *
   * @async
   * @param {string|number} teacherId - The unique identifier of the teacher.
   * @returns {Promise<Array>} An array of class objects with their associated sessions, evaluations, announcements, enrollments, and teachings.
   * @throws {Error} If there's an issue with the database query.
   */
  async getClassesByTeacherId(teacherId) {
    // Fetch teachings data with related class data
    const teachings = await prisma.teaching.findMany({
      where: { teacherId },
      include: {
        class: {
          include: {
            sessions: true,
            evaluations: true,
            announcements: true,
            enrollments: true,
            teachings: true,
          },
        },
      },
    });

    // Extract the unique classes using a Set to filter out duplicates based on the classId
    const uniqueClasses = [];
    const classIds = new Set();

    teachings.forEach((teaching) => {
      const classData = teaching.class;

      // If the class ID is not already in the set, add it to uniqueClasses
      if (!classIds.has(classData.id)) {
        classIds.add(classData.id);
        uniqueClasses.push(classData);
      }
    });

    return uniqueClasses;
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
  async getStudentsByTeacherId(teacherId) {
    const teachings = await prisma.teaching.findMany({
      where: {teacherId},
      include: {
        session: {
          select: {
            classId: true,
          },
        },
      },
    });

    // Extract all class IDs the teacher teaches
    const classIds = teachings.map((teaching) => teaching.session.classId).filter(Boolean); // Remove any null/undefined values

    const students = await prisma.student.findMany({
      where: {
        enrollments: {
          some: {
            classId: {
              in: classIds,
            },
          },
        },
      },
      include: {
        user: true,
      },
      distinct: ["id"],
    });

    return students;
  }

  async getAllCourses(teacherId) {
    try {
      // Find all the teachings for the teacher, and include related class, curriculum, and lessons
      const teachings = await prisma.teaching.findMany({
        where: { teacherId },
        include: {
          class: {
            include: {
              // Include any additional relations you need here
            },
          },
        },
      });

      // Extract the classes (courses) from the teachings
      const courses = teachings.map(teaching => {
        return {
          classId: teaching.class.id,
          title: teaching.class.title,
          description: teaching.class.description,
          curriculum: teaching.class.curriculum ? {
            title: teaching.class.curriculum.title,
            description: teaching.class.curriculum.description,
            field: teaching.class.curriculum.field,
            type: teaching.class.curriculum.type,
            level: teaching.class.curriculum.level,
            lessons: teaching.class.curriculum.lessons.map(lesson => ({
              lessonId: lesson.id,
              title: lesson.title,
            })),
          } : null,
        };
      });

      // Deduplicate the courses based on classId, title, and description
      const uniqueCourses = [];
      const seenCourses = new Set();

      courses.forEach(course => {
        const key = `${course.classId}-${course.title}-${course.description}`;
        if (!seenCourses.has(key)) {
          seenCourses.add(key);
          uniqueCourses.push(course);
        }
      });

      return uniqueCourses;
    } catch (error) {
      console.error("Error fetching courses for teacher: ", error);
      throw new Error("Failed to fetch courses");
    }
  }


  async getCourseInfoById(courseId) {
    const course = await prisma.class.findUnique({
      where: { id: courseId },
      include: {
        sessions: true, // Include related sessions
        enrollments: {
          include: {
            student: true, // Include enrolled students
          },
        },
        teachings: {
          include: {
            teacher: true, // Include teacher details
          },
        },
      },
    });
    return course;
  }
}

module.exports = new TeacherService();
