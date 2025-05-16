const StudentService = require("../services/studentService");
const UserService = require("../services/userService");

class StudentController {
  /**
   * Creates a student profile with personal details and preferences.
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing student profile data
   * @param {number} req.body.age - Student's age
   * @param {string} req.body.languagePreference - Student's preferred language
   * @param {string[]} req.body.dietRestrictions - Student's dietary restrictions
   * @param {string} req.body.previousExperience - Student's previous experience
   * @param {string} req.body.miscellaneousRemarks - Additional remarks about the student
   * @param {string} req.body.parentPhoneNumber - Contact number of student's parent
   * @param {string} req.body.userId - ID of the user to associate with student profile
   * @param {Object} res - Express response object
   * @returns {Object} 201 status with success message or error response
   * @throws {Error} If there's an issue with the database operation
   */
  async createStudentProfile(req, res) {
    try {
      const { age, languagePreference, dietRestrictions, previousExperience, miscellaneousRemarks, parentPhoneNumber, userId } = req.body;
  
      if (!userId) return res.status(400).json({ message: "User ID is required" });
  
      const student = await UserService.findById(userId);
      if (!student) return res.status(404).json({ message: "User not found" });
  
      await StudentService.createStudentProfile(age, languagePreference, dietRestrictions, previousExperience, miscellaneousRemarks, parentPhoneNumber, userId);
      return res.status(201).json({ message: "Student profile created successfully" });
    } catch (error) {
      console.error("Error creating student profile: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getStudentProgress(req, res) {
    try {
      if(!req.user.userId) return res.status(404).json({ message: "User ID is required" });
      const progress = await StudentService.getStudentProgress(req.user.userId);
      return res.status(201).json(progress);

    } catch (error) {
      console.error("Error fetching student progress", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }

  async getStudentSummary(req, res) {
    try {
      if(!req.user.userId) return res.status(404).json({ message: "User ID is required" });
      const summary = await StudentService.getStudentSummary(req.user.userId);
      return res.status(201).json(summary);

    } catch (error) {
      console.error("Error fetching student summary", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }

  async getStudentNextKeywords(req, res) {
    try {
      if(!req.user.userId) return res.status(404).json({ message: "User ID is required" });
      const keywords = await StudentService.getStudentNextKeywords(req.user.userId);
      return res.status(201).json(keywords);

    } catch (error) {
      console.error("Error fetching student keywords", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }


  async postStudentKeywordProgress(req, res) {
    try {
      if(!req.user.userId) return res.status(404).json({ message: "User ID is required" });
      const progress = req.body.progress;

      await StudentService.postStudentKeywordProgress(req.user.userId, progress);
      return res.status(201).json({ message: "Posted student keyword progress successfully" });
    } catch (error) {
    console.error("Error posting student keyword progress", error);
    return res.status(500).json({message: "Internal server error"});
    }
  }

  async flushStudentProgress(req, res) {
    try {
      if(!req.user.userId) return res.status(404).json({ message: "User ID is required" });
      const progress = req.body.progress;

      await StudentService.flushStudentProgress(req.user.userId, progress);
      return res.status(201).json({ message: "Flushed student keyword progress successfully" });
    } catch (error) {
      console.error("Error flushing student progress", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }

  async postGameSession(req, res) {
    try {
      if(!req.user.userId) return res.status(404).json({ message: "User ID is required" });
      const gameSession = req.body.gameSession;

      await StudentService.postGameSession(req.user.userId, gameSession);
      return res.status(201).json({ message: "Posted student game-session successfully" });

    } catch (error) {
      console.error("Error posting student game-session", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }

  async patchGameSession(req, res) {
    try {
      if(!req.user.userId) return res.status(404).json({ message: "User ID is required" });
      const gameSession = req.body.gameSession;

      await StudentService.patchGameSession(req.user.userId, gameSession);
      return res.status(201).json({ message: "Patched student game-session successfully" });

    } catch (error) {
      console.error("Error patching student game-session", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }
}

module.exports = new StudentController();