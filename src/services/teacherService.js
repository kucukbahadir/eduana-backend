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
    try {
      await prisma.teacher.create({
        data: {
          email,
          phoneNumber,
          userId,
        },
      });
    } catch (err) {
      console.error("Error creating teacher profile:", err);
      throw new Error("Unable to create teacher profile");
    }
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
    try {
      return await prisma.teacher.findUnique({
        where: { id: teacherId },
        include: { user: true },
      });
    } catch (error) {
      console.error("Error finding teacher by ID:", error);
      throw new Error("Unable to retrieve teacher by ID");
    }
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
    try {
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

      return teachings.map((teaching) => teaching.class);
    } catch (error) {
      console.error("Error fetching classes for teacher:", error);
      throw new Error("Failed to fetch classes for teacher");
    }
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
    try {
      const teachings = await prisma.teaching.findMany({
        where: { teacherId },
        include: {
          session: {
            select: {
              classId: true,
            },
          },
        },
      });

      // Deduplicate class IDs the teacher teaches
      const classIds = [...new Set(teachings.map((teaching) => teaching.session.classId).filter(Boolean))];

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
        distinct: ["id"], // Prisma doesn't support this in all cases, ensure this works for your version
      });

      return students;
    } catch (error) {
      console.error("Error fetching students for teacher:", error);
      throw new Error("Failed to fetch students for teacher");
    }
  }

  /**
   * Retrieves all courses (classes) taught by a teacher.
   *
   * @async
   * @param {number} teacherId - ID of the teacher
   * @returns {Promise<Array>} - A list of courses taught by the teacher
   * @throws {Error} If there is an issue retrieving the courses
   */
  async getAllCourses(teacherId) {
    try {
      const teachings = await prisma.teaching.findMany({
        where: { teacherId },
        include: {
          class: {
            include: {
              curriculum: {
                include: {
                  lessons: true,
                },
              },
              sessions: true,
            },
          },
        },
      });

      // Extract and map courses (classes)
      const courses = teachings.map((teaching) => {
        const { class: classInfo } = teaching;
        return {
          classId: classInfo.id,
          title: classInfo.title,
          description: classInfo.description,
          curriculum: classInfo.curriculum
              ? {
                title: classInfo.curriculum.title,
                description: classInfo.curriculum.description,
                field: classInfo.curriculum.field,
                type: classInfo.curriculum.type,
                level: classInfo.curriculum.level,
                lessons: classInfo.curriculum.lessons.map((lesson) => ({
                  lessonId: lesson.id,
                  title: lesson.title,
                })),
              }
              : null,
          sessions: classInfo.sessions.map((session) => ({
            sessionId: session.id,
            start: session.start,
            end: session.end,
          })),
        };
      });

      return courses;
    } catch (error) {
      console.error("Error fetching courses for teacher:", error);
      throw new Error("Failed to fetch courses");
    }
  }

  /**
   * Retrieves course information by its ID.
   *
   * @async
   * @param {number} courseId - The ID of the course
   * @returns {Promise<Object|null>} - The detailed course information, including sessions, students, and teachings
   * @throws {Error} If there is an issue with the database query
   */
  async getCourseInfoById(courseId) {
    try {
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
    } catch (error) {
      console.error("Error fetching course info by ID:", error);
      throw new Error("Failed to retrieve course information");
    }
  }
}



module.exports = new TeacherService();
