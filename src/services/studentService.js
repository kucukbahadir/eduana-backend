const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @class StudentService
 * @description Service layer for handling all student-related business logic and database interactions.
 */
class StudentService {
  /**
   * Creates a new student profile in the database, associating it with an existing user ID.
   *
   * @async
   * @param {number} age - The age of the student.
   * @param {string} languagePreference - The preferred language of the student.
   * @param {string[]} dietRestrictions - Any dietary restrictions the student may have.
   * @param {string} previousExperience - The student's previous experience.
   * @param {string} miscellaneousRemarks - Any additional remarks about the student.
   * @param {string} parentPhoneNumber - The phone number of the student's parent (not directly mapped to User model).
   * @param {string|number} userId - The ID of the user to connect with this student profile. This will be the ID for the new User record.
   * @param {string} fullName - The full name of the student.
   * @returns {Promise<Object>} The created user (student) profile object.
   * @throws {Error} If there is an issue with the database operation.
   */
  async createStudentProfile(age, languagePreference, dietRestrictions, previousExperience, miscellaneousRemarks, parentPhoneNumber, userId, fullName) {
    return prisma.user.create({
      data: {
        id: userId,
        full_name: fullName,
        age,
        language_preference: languagePreference,
        diet_restrictions: dietRestrictions,
        experience: previousExperience,
        remarks: miscellaneousRemarks,
        role: "STUDENT",
        parent_phone_number: parentPhoneNumber, // Uncomment this line
      },
    });
  }


  /**
   * Returns all keyword progress data for the student, organized by curriculum, lessons, and keywords.
   *
   * @async
   * @param {string} studentId - The ID of the student.
   * @returns {Promise<Object|null>} Student progress data formatted for the frontend, or null if student is not found.
   */
  async getStudentProgress(studentId) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        full_name: true,
        studentKeywordProgresses: {
          select: {
            learning_progress: true, // This is the 'level' for student mastery
            updated_at: true, // Using updated_at as proxy for lastPracticed
            keyword: {
              select: {
                value: true,
                lessons: {
                  select: {
                    lesson: {
                      select: {
                        title: true, // Lesson name
                        created_at: true, // Using created_at for lessonDate
                        curriculum: {
                          select: {
                            title: true, // Domain name (Curriculum title)
                            levels: {
                              select: {
                                level_number: true, // Level number within the curriculum
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    const domains = {};

    student.studentKeywordProgresses.forEach((kp) => {

      const relevantLesson = kp.keyword.lessons[0]?.lesson;

      if (relevantLesson) {
        const domainName = relevantLesson.curriculum?.title || "Uncategorized";
        const levelNumber = relevantLesson.curriculum?.levels[0]?.level_number || 0;
        const lessonName = relevantLesson.title;
        const lessonDate = relevantLesson.created_at ? relevantLesson.created_at.toISOString().split("T")[0] : null;

        if (!domains[domainName]) {
          domains[domainName] = { domainName, levels: {} };
        }
        if (!domains[domainName].levels[levelNumber]) {
          domains[domainName].levels[levelNumber] = { levelNumber, lessons: {} };
        }
        if (!domains[domainName].levels[levelNumber].lessons[lessonName]) {
          domains[domainName].levels[levelNumber].lessons[lessonName] = {
            lessonName,
            lessonDate,
            keywords: [],
          };
        }

        domains[domainName].levels[levelNumber].lessons[lessonName].keywords.push({
          keyword: kp.keyword.value,
          level: kp.learning_progress,
          lastPracticed: kp.updated_at ? kp.updated_at.toISOString().split("T")[0] : null,
        });
      }
    });

    const formattedDomains = Object.values(domains).map((domain) => ({
      ...domain,
      levels: Object.values(domain.levels).map((level) => ({
        ...level,
        lessons: Object.values(level.lessons),
      })),
    }));

    return {
      studentId: student.id,
      name: student.full_name,
      domains: formattedDomains,
    };
  }


  /**
   * Returns a summary of the student’s keyword progress for dashboards.
   * This includes total keywords, mastered, in progress, never seen, and last played session.
   *
   * @async
   * @param {string} studentId - The ID of the student.
   * @returns {Promise<Object>} Student summary data.
   */
  async getStudentSummary(studentId) {
    const totalKeywords = await prisma.studentKeywordProgress.count({
      where: { student_id: studentId },
    });

    const mastered = await prisma.studentKeywordProgress.count({
      where: { student_id: studentId, learning_progress: 4 },
    });

    const inProgress = await prisma.studentKeywordProgress.count({
      where: { student_id: studentId, learning_progress: { gt: 0, lt: 4 } },
    });

    const neverSeen = await prisma.keyword.count({
      where: {
        NOT: {
          studentKeywordProgresses: {
            some: {
              student_id: studentId,
            },
          },
        },
      },
    });

    const lastPlayedSession = await prisma.gameSession.findFirst({
      where: { student_id: studentId },
      orderBy: { ended_at: "desc" },
      select: { ended_at: true },
    });

    return {
      totalKeywords,
      mastered,
      inProgress,
      neverSeen,
      lastPlayed: lastPlayedSession ? lastPlayedSession.ended_at.toISOString() : null,
    };
  }


 async getStudentNextKeywords(studentId) {
    const unseenKeywords = await prisma.keyword.findMany({
      where: {
        NOT: {
          studentKeywordProgresses: {
            some: { student_id: studentId },
          },
        },
      },
      select: { id: true, value: true },
      take: 10,
    });

    const formattedUnseen = unseenKeywords.map(k => ({ keyword: k.value, level: 0 }));
    if (formattedUnseen.length === 10) return { keywords: formattedUnseen };

    const partiallyLearnedKeywords = await prisma.studentKeywordProgress.findMany({
      where: {
        student_id: studentId,
        learning_progress: { gt: 0, lt: 4 },
      },
      select: {
        keyword: { select: { value: true } },
        learning_progress: true,
      },
      orderBy: { learning_progress: "asc" },
      take: 10 - formattedUnseen.length,
    });

    const formattedPartiallyLearned = partiallyLearnedKeywords.map(kp => ({
      keyword: kp.keyword.value,
      level: kp.learning_progress,
    }));

    return { keywords: [...formattedUnseen, ...formattedPartiallyLearned] };
  }

  async postStudentKeywordProgress(studentId, { keyword, toLevel, answeredAt }) {
    const keywordRecord = await prisma.keyword.findUnique({ where: { value: keyword } });
    if (!keywordRecord) throw new Error(`Keyword '${keyword}' not found.`);

    const validatedToLevel = Math.max(0, Math.min(4, toLevel));

    return prisma.studentKeywordProgress.upsert({
      where: {
        student_id_keyword_id: {
          student_id: studentId,
          keyword_id: keywordRecord.id,
        },
      },
      update: {
        learning_progress: validatedToLevel,
        updated_at: new Date(answeredAt),
      },
      create: {
        student_id: studentId,
        keyword_id: keywordRecord.id,
        learning_progress: validatedToLevel,
      },
    });
  }

  async flushStudentProgress(studentId, progressData) {
    const updates = [];

    for (const item of progressData) {
      const keywordRecord = await prisma.keyword.findUnique({ where: { value: item.keyword } });
      if (!keywordRecord) {
        console.warn(`Keyword '${item.keyword}' not found. Skipping.`);
        continue;
      }

      const validatedToLevel = Math.max(0, Math.min(4, item.toLevel));

      updates.push(
        prisma.studentKeywordProgress.upsert({
          where: {
            student_id_keyword_id: {
              student_id: studentId,
              keyword_id: keywordRecord.id,
            },
          },
          update: {
            learning_progress: validatedToLevel,
            updated_at: new Date(),
          },
          create: {
            student_id: studentId,
            keyword_id: keywordRecord.id,
            learning_progress: validatedToLevel,
          },
        })
      );
    }

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }
  }

  async postGameSession(studentId, { game, startedAt }) {
    const gameRecord = await prisma.game.findUnique({ where: { name: game } });
    if (!gameRecord) throw new Error(`Game '${game}' not found.`);

    return prisma.gameSession.create({
      data: {
        student: { connect: { id: studentId } },
        game: { connect: { id: gameRecord.id } },
        started_at: new Date(startedAt),
      },
    });
  }

  async patchGameSession(studentId, { sessionId, endedAt, durationSeconds }) {
    return prisma.gameSession.update({
      where: {
        id: sessionId,
        student_id: studentId,
        ended_at: null,
      },
      data: {
        ended_at: new Date(endedAt),
        durationSeconds,
      },
    });
  }
}

module.exports = new StudentService();