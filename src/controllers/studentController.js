const StudentService = require("../services/studentService");
const UserService = require("../services/userService");

/**
 * @class StudentController
 * @description Controller for handling student-related operations, including profile management,
 * progress tracking, keyword retrieval, and game session management.
 */
class StudentController {
  /**
   * Creates a student profile with personal details and preferences.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.body - Request body containing student profile data.
   * @param {number} req.body.age - Student's age.
   * @param {string} req.body.languagePreference - Student's preferred language.
   * @param {string[]} req.body.dietRestrictions - Student's dietary restrictions.
   * @param {string} req.body.previousExperience - Student's previous experience.
   * @param {string} req.body.miscellaneousRemarks - Additional remarks about the student.
   * @param {string} req.body.parentPhoneNumber - Contact number of student's parent.
   * @param {string} req.body.userId - ID of the user to associate with student profile.
   * @param {string} req.body.fullName - Full name of the student.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 201 status with success message or error response.
   * @throws {Error} If there's an issue with the database operation.
   */
  async createStudentProfile(req, res) {
    try {
      const {
        age,
        languagePreference,
        dietRestrictions,
        previousExperience,
        miscellaneousRemarks,
        parentPhoneNumber,
        userId,
        fullName
      } = req.body;

      if (!userId || !fullName || age === undefined || !languagePreference) {
        return res.status(400).json({ message: "Missing required fields: userId, fullName, age, or languagePreference." });
      }

      const userExists = await UserService.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found. Cannot create student profile." });
      }

      await StudentService.createStudentProfile(age, languagePreference, dietRestrictions, previousExperience, miscellaneousRemarks, parentPhoneNumber, userId, fullName);
      return res.status(201).json({ message: "Student profile created successfully." });
    } catch (error) {
      console.error("Error creating student profile:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Retrieves all keyword progress data for a specific student, organized by curriculum.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with student progress data or error response.
   * @throws {Error} If there's an issue fetching the data.
   */
  async getStudentProgress(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const progress = await StudentService.getStudentProgress(req.user.userId);

      if (!progress) {
        return res.status(404).json({ message: "Student progress not found for this user." });
      }

      return res.status(200).json(progress);
    } catch (error) {
      console.error("Error fetching student progress:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Retrieves a summary of the student’s keyword progress for dashboards.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with student summary data or error response.
   * @throws {Error} If there's an issue fetching the data.
   */
  async getStudentSummary(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const summary = await StudentService.getStudentSummary(req.user.userId);

      if (!summary) {
        return res.status(404).json({ message: "Student summary not found for this user." });
      }
      return res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching student summary:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Retrieves the next set of keywords for a student, typically for game sessions.
   * Orders: First unseen → then partially learned. Limits to 10 keywords.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with a list of keywords or error response.
   * @throws {Error} If there's an issue fetching the data.
   */
  async getStudentNextKeywords(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const keywords = await StudentService.getStudentNextKeywords(req.user.userId);

      return res.status(200).json(keywords);
    } catch (error) {
      console.error("Error fetching student keywords:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Posts an individual student keyword progress update.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} req.body - Request body containing the progress data.
   * @param {string} req.body.keyword - The keyword value.
   * @param {number} req.body.toLevel - The new mastery level for the keyword (0-4).
   * @param {string} req.body.answeredAt - UTC ISO 8601 format timestamp when the keyword was answered.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 201 status with success message or error response.
   * @throws {Error} If the keyword is not found or other database issues.
   */
  async postStudentKeywordProgress(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }

      const { keyword, toLevel, answeredAt } = req.body;

      if (!keyword || toLevel === undefined || !answeredAt) {
        return res.status(400).json({ message: "Missing required progress data: keyword, toLevel, or answeredAt." });
      }

      await StudentService.postStudentKeywordProgress(req.user.userId, { keyword, toLevel, answeredAt });

      return res.status(201).json({ message: "Posted student keyword progress successfully." });
    } catch (error) {
      console.error("Error posting student keyword progress:", error);

      if (error.message.includes("Keyword") && error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Submits multiple keyword progress updates for a student in a single batch.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object[]} req.body.progress - An array of keyword progress objects.
   * @param {string} req.body.progress[].keyword - The keyword value.
   * @param {number} req.body.progress[].toLevel - The new mastery level for the keyword (0-4).
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 201 status with success message or error response.
   * @throws {Error} If there's an issue with the bulk update.
   */
  async flushStudentProgress(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const progress = req.body.progress;

      if (!Array.isArray(progress)) {
        return res.status(400).json({ message: "Progress data must be an array." });
      }

      await StudentService.flushStudentProgress(req.user.userId, progress);
      return res.status(201).json({ message: "Flushed student keyword progress successfully." });
    } catch (error) {
      console.error("Error flushing student progress:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Records the start of a new game session for a student.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} req.body - Request body containing game session details.
   * @param {string} req.body.game - The name of the game played.
   * @param {string} req.body.startedAt - UTC ISO 8601 format timestamp when the game started.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 201 status with success message or error response.
   * @throws {Error} If the game is not found or other database issues.
   */
  async postGameSession(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const { game, startedAt } = req.body;

      if (!game || !startedAt) {
        return res.status(400).json({ message: "Missing required game session data: game or startedAt." });
      }

      await StudentService.postGameSession(req.user.userId, { game, startedAt });
      return res.status(201).json({ message: "Posted student game session successfully." });

    } catch (error) {
      console.error("Error posting student game session:", error);
      if (error.message.includes("Game") && error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Updates an existing game session, typically to mark it as completed.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} req.body - Request body containing game session completion details.
   * @param {string} req.body.sessionId - The ID of the game session to update.
   * @param {string} req.body.endedAt - UTC ISO 8601 format timestamp when the game ended.
   * @param {number} req.body.durationSeconds - Duration of the session in seconds.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with success message or error response.
   * @throws {Error} If the session is not found or does not belong to the student.
   */
  async patchGameSession(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      // Get sessionId from URL parameters
      const { sessionId } = req.params;
      const { endedAt, durationSeconds } = req.body; // endedAt and durationSeconds are still from body

      if (!sessionId || !endedAt || durationSeconds === undefined) {
        return res.status(400).json({ message: "Missing required game session patch data: sessionId, endedAt, or durationSeconds." });
      }

      await StudentService.patchGameSession(req.user.userId, { sessionId, endedAt, durationSeconds });
      return res.status(200).json({ message: "Patched student game session successfully." });

    } catch (error) {
      console.error("Error patching student game session:", error);
      if (error.message.includes("Record to update not found")) {
        return res.status(404).json({ message: "Game session not found or does not belong to the user." });
      }
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Retrieves all classes associated with a student.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with list of classes or error response.
   * @throws {Error} If there's an issue fetching the data.
   */
  async getStudentClasses(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const classes = await StudentService.getStudentClasses(req.user.userId);

      if (!classes || classes.length === 0) {
        return res.status(404).json({ message: "No classes found for this student." });
      }

      return res.status(200).json(classes);
    } catch (error) {
      console.error("Error fetching student classes:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Retrieves a specific class by its ID for a student.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {string} req.params.classId - The ID of the class to retrieve.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with class details or error response.  
   * @throws {Error} If the class is not found or does not belong to the student.
   * */
  async getStudentClass(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const { classId } = req.params;

      if (!classId) {
        return res.status(400).json({ message: "Missing required classId parameter." });
      }

      const studentClass = await StudentService.getStudentClass(req.user.userId, classId);

      if (!studentClass) {
        return res.status(404).json({ message: "Class not found or does not belong to the student." });
      }

      return res.status(200).json(studentClass);
    } catch (error) {
      console.error("Error fetching student class:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
}

  /**
   * Retrieves all sessions associated with a student.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with list of sessions or error response.
   * @throws {Error} If there's an issue fetching the data.
   */
  async getStudentSessions(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const sessions = await StudentService.getStudentSessions(req.user.userId);

      if (!sessions || sessions.length === 0) {
        return res.status(404).json({ message: "No sessions found for this student." });
      }

      return res.status(200).json(sessions);
    } catch (error) {
      console.error("Error fetching student sessions:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Retrieves a specific session by its ID for a student.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {string} req.params.sessionId - The ID of the session to retrieve.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with session details or error response.
   * @throws {Error} If the session is not found or does not belong to the student.
   */
  async getStudentSession(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ message: "Missing required sessionId parameter." });
      }

      const session = await StudentService.getStudentSession(req.user.userId, sessionId);

      if (!session) {
        return res.status(404).json({ message: "Session not found or does not belong to the student." });
      }

      return res.status(200).json(session);
    } catch (error) {
      console.error("Error fetching student session:", error);
      return res.status(500).json({ message: "Internal server error." });
    } 
  }

  /**
   * Retrieves all announcements for a student.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with list of announcements or error response.
   * @throws {Error} If there's an issue fetching the data.
   */
  async getStudentAnnouncements(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const announcements = await StudentService.getStudentAnnouncements(req.user.userId);

      if (!announcements || announcements.length === 0) {
        return res.status(404).json({ message: "No announcements found for this student." });
      }

      return res.status(200).json(announcements);
    } catch (error) {
      console.error("Error fetching student announcements:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Retrieves all evaluations for a student.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with list of evaluations or error response.
   * @throws {Error} If there's an issue fetching the data.
   */
  async getStudentEvaluations(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const evaluations = await StudentService.getStudentEvaluations(req.user.userId);

      if (!evaluations || evaluations.length === 0) {
        return res.status(404).json({ message: "No evaluations found for this student." });
      }

      return res.status(200).json(evaluations);
    } catch (error) {
      console.error("Error fetching student evaluations:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Retrieves a specific evaluation by its ID for a student.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {string} req.params.evaluationId - The ID of the evaluation to retrieve.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with evaluation details or error response.
   * @throws {Error} If the evaluation is not found or does not belong to the student.
   */
  async getStudentEvaluation(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const { evaluationId } = req.params;

      if (!evaluationId) {
        return res.status(400).json({ message: "Missing required evaluationId parameter." });
      }

      const evaluation = await StudentService.getStudentEvaluation(req.user.userId, evaluationId);

      if (!evaluation) {
        return res.status(404).json({ message: "Evaluation not found or does not belong to the student." });
      }

      return res.status(200).json(evaluation);
    } catch (error) {
      console.error("Error fetching student evaluation:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  /**
   * Retrieves the student profile for the authenticated user.
   *
   * @param {Object} req - Express request object.
   * @param {Object} req.user - Authenticated user object containing userId.
   * @param {string} req.user.userId - The ID of the authenticated student.
   * @param {Object} res - Express response object.
   * @returns {Promise<Object>} 200 status with student profile data or error response.
   * @throws {Error} If there's an issue fetching the profile.
   */
  async getStudentProfile(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated or user ID is missing." });
      }
      const profile = await StudentService.getStudentProfile(req.user.userId);

      if (!profile) {
        return res.status(404).json({ message: "Student profile not found for this user." });
      }

      return res.status(200).json(profile);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}
module.exports = new StudentController();