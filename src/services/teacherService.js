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
    // Get all sessions taught by the teacher, and extract class IDs
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

    // Extract all class IDs the teacher teaches
    const classIds = teachings
        .map((teaching) => teaching.session?.classId)
        .filter(Boolean); // Removes null or undefined

    // Now get all students enrolled in those classes
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
        user: {
          select: {
            id: true,
            name: true,      // <--- Include name explicitly
            username: true,  // optional if needed
          },
        },
      },
      distinct: ['id'], // Ensure uniqueness
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
    // const course = await prisma.class.findUnique({
    //   where: { id: courseId },
    //   include: {
    //     sessions: true, // Include related sessions
    //     enrollments: {
    //       include: {
    //         student: true, // Include enrolled students
    //       },
    //     },
    //     teachings: {
    //       include: {
    //         teacher: true, // Include teacher details
    //       },
    //     },
    //   },
    // });
    // return course;
    // Simulate a delay like a real DB call
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      id: 17,
      title: "03 - Leds and Breadboards",
      subtitle: "03 - Navigating Fundamentals | Electronics Level 1",

      lessonPreparation: {
        learningGoals: {
          label: "Learning goals",
          content: `
1. Understand the basics of LEDs: Students will learn what LEDs are, how they function, and the role they play in various electronic devices.
2. Explore color mixing with RGB: Students will understand the concept of RGB and how combining red, green, and blue light in different intensities can produce a wide range of colors.
3. Operate LEDs: Students will be able to set up various LED circuits and learn how to increase/decrease brightness.
4. Experiment with breadboards: Students will get hands-on experience in constructing and modifying simple circuits using a breadboard, enhancing their understanding of circuit design.
5. Identify and prevent short circuits: Students will learn what causes short circuits and how to avoid them.
        `
        },
        keywords: {
          label: "Keywords",
          content: "LED, Breadboard, RGB, Circuit, Voltage, Resistance, Short Circuit"
        },
        presentation: {
          label: "Presentation",
          content: "Slides and talking points covering theory, visuals of components, and examples."
        },
        kahootQuiz: {
          label: "Kahoot Quiz",
          content: "Quiz link: https://kahoot.it/challenge/123456"
        }
      },

      materials: [
        {
          id: "materialsList",
          label: "Materials",
          content: [
            "Breadboards (1 for each student)",
            "LEDs",
            "Resistors",
            "Crocodile clips",
            "Batteries"
          ]
        },
        {
          id: "presentation",
          label: "Presentation",
          content: "Download the presentation slides on the course portal under 'Week 3'."
        }
      ],

      activities: [
        {
          id: "partA",
          label: "Part A",
          content: `
Engagement (5 minutes):
- Introduce the topic using the provided text or your own relevant examples.

Exploring (10–15 minutes):
- Activity: Technology Scavenger Hunt
- Goal: Motivate students to key technological concepts through an interactive activity.
- Materials: Name funny classroom items or personal belongings.
- Instructions:
  1. Form into pairs.
  2. Provide each pair with a list of technology-related terms.
  3. Have students find real-world examples within the classroom.
  4. Discuss findings with the class.
        `
        },
        {
          id: "partB",
          label: "Part B",
          content: "Breadboard hands-on circuit activity — pair students and provide starter circuit diagram."
        },
        {
          id: "partC",
          label: "Part C",
          content: "Wrap-up, Q&A, and assign optional quiz."
        }
      ]
    };
  }
}

module.exports = new TeacherService();
