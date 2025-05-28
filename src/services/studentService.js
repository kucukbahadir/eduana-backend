const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class StudentService {
  /**
   * Creates a new student profile in the database.
   *
   * @async
   * @param {number} age - The age of the student.
   * @param {string} languagePreference - The preferred language of the student.
   * @param {string} dietRestrictions - Any dietary restrictions the student may have.
   * @param {string} previousExperience - The student's previous experience.
   * @param {string} miscellaneousRemarks - Any additional remarks about the student.
   * @param {string} parentPhoneNumber - The phone number of the student's parent (not directly mapped to User model).
   * @param {string|number} userId - The ID of the user to connect with this student profile.
   * @param {string} fullName - The full name of the student.
   * @returns {Promise<Object>} The created user (student) profile object.
   * @throws {Error} If there is an issue with the database operation.
   */
  async createStudentProfile(age, languagePreference, dietRestrictions, previousExperience, miscellaneousRemarks, parentPhoneNumber, userId, fullName) {

    return prisma.user.create({
      data: {
        id: userId, // Assuming userId is provided and should be used as the User's ID
        full_name: fullName, // Must be provided as it's a required field in User model
        age,
        language_preference: languagePreference,
        diet_restrictions: dietRestrictions,
        experience: previousExperience,
        remarks: miscellaneousRemarks,
        role: "STUDENT",
      },
    });
  }

  /**
   * Returns all keyword progress data for the student, organized by curriculum.
   * @param {string} studentId - The ID of the student.
   * @returns {Promise<Object>} Student progress data.
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
        // Attempt to get the first level number associated with the curriculum.
        // This might need refinement if a lesson/keyword is strictly tied to a single Level model.
        const levelNumber = relevantLesson.curriculum?.levels[0]?.level_number || 0;
        const lessonName = relevantLesson.title;
        // Format to "YYYY-MM-DD" as requested in the API spec
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
          level: kp.learning_progress, // Student's mastery level
          lastPracticed: kp.updated_at ? kp.updated_at.toISOString().split("T")[0] : null, // Using updated_at
        });
      }
    });

    // Convert the nested objects into arrays for the final response format
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

    // Keywords the student has never seen (i.e., no progress entry for them)
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

  /**
   * Called when the game starts or when a new keyword set is needed.
   * Orders: First unseen → then partially learned. Limits to 10 keywords.
   * @param {string} studentId - The ID of the student.
   * @returns {Promise<Object>} List of keywords for the game.
   */
  async getStudentNextKeywords(studentId) {
    // Get unseen keywords (keywords with no progress entry for this student)
    const unseenKeywords = await prisma.keyword.findMany({
      where: {
        NOT: {
          studentKeywordProgresses: {
            some: {
              student_id: studentId,
            },
          },
        },
      },
      select: { id: true, value: true },
      take: 10,
    });

    const formattedUnseen = unseenKeywords.map((k) => ({ keyword: k.value, level: 0 }));

    if (formattedUnseen.length === 10) {
      return { keywords: formattedUnseen };
    }

    // Get partially learned keywords (progress level between 1 and 3)
    const partiallyLearnedKeywords = await prisma.studentKeywordProgress.findMany({
      where: {
        student_id: studentId,
        learning_progress: { gt: 0, lt: 4 },
      },
      select: { keyword: { select: { value: true } }, learning_progress: true },
      take: 10 - formattedUnseen.length, // Fill up to 10
      orderBy: { learning_progress: "asc" }, // Prioritize lower mastery levels
    });

    const formattedPartiallyLearned = partiallyLearnedKeywords.map((kp) => ({
      keyword: kp.keyword.value,
      level: kp.learning_progress,
    }));

    return { keywords: [...formattedUnseen, ...formattedPartiallyLearned] };
  }

  /**
   * Updates keyword progress for a student.
   * @param {string} studentId - The ID of the student.
   * @param {Object} data - Keyword progress data.
   * @param {string} data.keyword - The keyword value.
   * @param {number} data.toLevel - The new level.
   * @param {string} data.answeredAt - UTC ISO 8601 format timestamp.
   * @returns {Promise<Object>} The updated student keyword progress entry.
   */
  async postStudentKeywordProgress(studentId, { keyword, toLevel, answeredAt }) {
    const keywordRecord = await prisma.keyword.findUnique({
      where: { value: keyword },
    });

    if (!keywordRecord) {
      throw new Error(`Keyword '${keyword}' not found.`);
    }

    // Ensure mastery level is between 0 and 4
    const validatedToLevel = Math.max(0, Math.min(4, toLevel));

    return prisma.studentKeywordProgress.upsert({
      where: {
        student_id_keyword_id: { // Using the composite unique ID
          student_id: studentId,
          keyword_id: keywordRecord.id,
        },
      },
      update: {
        learning_progress: validatedToLevel,
        updated_at: new Date(answeredAt), // Using updated_at as the last practiced time
      },
      create: {
        student_id: studentId,
        keyword_id: keywordRecord.id,
        learning_progress: validatedToLevel,
        // created_at will default to now if not provided, for initial creation
      },
    });
  }

  /**
   * Submits multiple keyword progress updates in bulk.
   * @param {string} studentId - The ID of the student.
   * @param {Array<Object>} progressData - An array of keyword progress objects.
   * @returns {Promise<void>}
   */
  async flushStudentProgress(studentId, progressData) {
    const updates = progressData.map(async (item) => {
      const keywordRecord = await prisma.keyword.findUnique({
        where: { value: item.keyword },
      });

      if (!keywordRecord) {
        console.warn(`Keyword '${item.keyword}' not found during bulk flush for student ${studentId}.`);
        return null; // Skip this item if keyword doesn't exist
      }

      const validatedToLevel = Math.max(0, Math.min(4, item.toLevel));

      return prisma.studentKeywordProgress.upsert({
        where: {
          student_id_keyword_id: {
            student_id: studentId,
            keyword_id: keywordRecord.id,
          },
        },
        update: {
          learning_progress: validatedToLevel,
          updated_at: new Date(), // Use current time for bulk flush
        },
        create: {
          student_id: studentId,
          keyword_id: keywordRecord.id,
          learning_progress: validatedToLevel,
        },
      });
    }).filter(Boolean); // Filter out nulls from skipped keywords

    // Execute all upserts in a transaction
    await prisma.$transaction(updates);
  }

  /**
   * Records the start of a game session.
   * @param {string} studentId - The ID of the student.
   * @param {Object} gameSessionData - Game session details.
   * @param {string} gameSessionData.game - Name of the game.
   * @param {string} gameSessionData.startedAt - UTC ISO 8601 format timestamp.
   * @returns {Promise<Object>} The created game session object.
   */
  async postGameSession(studentId, { game, startedAt }) {
    const gameRecord = await prisma.game.findUnique({
      where: { name: game },
    });

    if (!gameRecord) {
      throw new Error(`Game '${game}' not found.`);
    }

    return prisma.gameSession.create({
      data: {
        student: {connect: {id: studentId}},
        game: {connect: {id: gameRecord.id}},
        started_at: new Date(startedAt),
      },
    });
  }

  /**
   * Marks a game session as completed.
   * @param {string} studentId - The ID of the student.
   * @param {Object} gameSessionData - Game session completion details.
   * @param {string} gameSessionData.sessionId - The ID of the game session to update.
   * @param {string} gameSessionData.endedAt - UTC ISO 8601 format timestamp.
   * @param {number} gameSessionData.durationSeconds - Duration of the session in seconds.
   * @returns {Promise<Object>} The updated game session object.
   */
  async patchGameSession(studentId, { sessionId, endedAt, durationSeconds }) {
    return prisma.gameSession.update({
      where: {
        id: sessionId,
        student_id: studentId, // Ensure the session belongs to the student for security
      },
      data: {
        ended_at: new Date(endedAt),
        durationSeconds: durationSeconds,
      },
    });
  }
}

module.exports = new StudentService();