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

  /**
   * Gets all classes for a specific teacher
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.teacherId - ID of the teacher to get classes for
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} - JSON response with classes or error message
   * @throws {Error} - If there's an error retrieving the classes
   */
  async getClasses(req, res) {
    try {
      const teacherId = req.params.teacherId;
      if (!teacherId) return res.status(400).json({ message: "Teacher ID is required" });
      if(isNaN(teacherId)) return res.status(400).json({ message: "Invalid Teacher ID" });

      const teacher = await TeacherService.findById(parseInt(teacherId));
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  
      const classes = await TeacherService.getClassesByTeacherId(parseInt(teacherId));
      
      return res.status(200).json(classes);
    } catch (error) {
      console.error("Error getting classes: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Retrieves all students associated with a specific teacher.
   * 
   * @async
   * @function getStudents
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.teacherId - Teacher ID to lookup
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with students array or error message
   * @throws {Error} If there's an issue retrieving the students
   * 
   * @example
   * // Returns status 200 with students data
   * // { students: [...] }
   * 
   * @example
   * // Returns status 400 if teacher ID is missing or invalid
   * // { message: "Teacher ID is required" } or { message: "Invalid teacher ID" }
   * 
   * @example
   * // Returns status 404 if teacher not found or no students found
   * // { message: "Teacher not found" } or { message: "No students found" }
   */
  async getStudents(req, res) {
    try {
      const teacherId = req.params.teacherId;
      if (!teacherId) return res.status(400).json({ message: "Teacher ID is required" });
      if (isNaN(teacherId)) return res.status(400).json({ message: "Invalid teacher ID" });

      const teacher = await TeacherService.findById(parseInt(teacherId));
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });

      const students = await TeacherService.getStudentsByTeacherId(parseInt(teacherId));
      
      return res.status(200).json({ students });
    } catch (error) {
      console.error("Error getting students: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new TeacherController();