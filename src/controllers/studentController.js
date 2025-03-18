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
}

module.exports = new StudentController();