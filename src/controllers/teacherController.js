const TeacherService = require("../services/teacherService");
const UserService = require("../services/userService");

class TeacherController {
  /**
   * Creates a teacher profile with the provided information
   * 
   * @async
   * @function createTeacherProfile
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing teacher information
   * @param {string} req.body.email - Teacher's email address
   * @param {string} req.body.phoneNumber - Teacher's phone number
   * @param {string} req.body.userId - ID of the user to associate with the teacher profile
   * @param {Object} res - Express response object
   * @returns {Object} 201 status with success message if created successfully
   * @returns {Object} 400 status with error message if required fields are missing or invalid
   * @returns {Object} 404 status with error message if the user is not found
   * @returns {Object} 500 status with error message if server error occurs
   * @throws {Error} When there is an issue creating the teacher profile
   */
  async createTeacherProfile(req, res) {
    try {
      const { email, phoneNumber, userId } = req.body;
  
      if (!phoneNumber) return res.status(400).json({ message: "Phone number is required" });
      if (!userId) return res.status(400).json({ message: "User ID is required" });
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) return res.status(400).json({ message: "Email is required" });
      if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email address" });

      const teacher = await UserService.findById(userId);
      if (!teacher) return res.status(404).json({ message: "User not found" });

      await TeacherService.createTeacherProfile(email, phoneNumber, userId);
      return res.status(201).json({ message: "Teacher profile created successfully" });
    } catch (error) {
      console.error("Error creating teacher profile: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new TeacherController();