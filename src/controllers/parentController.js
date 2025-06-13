const ParentService = require("../services/parentService");
const UserService = require("../services/userService");

class ParentController {
  /**
   * Creates a parent profile with the provided information
   * @async
   * @function createParentProfile
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.email - Parent's email address
   * @param {string} req.body.phoneNumber - Parent's phone number
   * @param {string} req.body.userId - User ID associated with the parent
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with status and message
   * @throws {Error} If there's an issue creating the parent profile
   */
  async createParentProfile(req, res) {
    try {
      const { email, phoneNumber, userId } = req.body;
  
      if (!phoneNumber) return res.status(400).json({ message: "Phone number is required" });
      if (!userId) return res.status(400).json({ message: "User ID is required" });
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) return res.status(400).json({ message: "Email is required" });
      if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email address" });

      const parent = await UserService.findById(userId);
      if (!parent) return res.status(404).json({ message: "User not found" });

      await ParentService.createParentProfile(email, phoneNumber, userId);
      return res.status(201).json({ message: "Parent profile created successfully" });
    } catch (error) {
      console.error("Error creating parent profile: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Retrieves a list of children associated with the parent
   * @async
   * @function getChildren
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with status and list of children
   */
  async getChildren(req, res) {
    try {
      const parentId = req.user.id; // Assuming the parent ID is stored in req.user.id
      const children = await ParentService.getChildrenByParentId(parentId);
      return res.status(200).json({ children });
    } catch (error) {
      console.error("Error retrieving children: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
}
  /**
   * Retrieves attendance records for a specific child
   * @async
   * @function getChildAttendance
   * @param {Object} req - Express request object
   * @param {string} req.params.childId - ID of the child
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with status and attendance records
   */
  async getChildAttendance(req, res) {
    try {
      const { childId } = req.params;
      const attendanceRecords = await ParentService.getChildAttendance(childId);
      return res.status(200).json({ attendanceRecords });
    } catch (error) {
      console.error("Error retrieving child attendance: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Retrieves evaluations for a specific child
   * @async
   * @function getChildEvaluations
   * @param {Object} req - Express request object
   * @param {string} req.params.childId - ID of the child
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with status and evaluations
   */
  async getChildEvaluations(req, res) {
    try {
      const { childId } = req.params;
      const evaluations = await ParentService.getChildEvaluations(childId);
      return res.status(200).json({ evaluations });
    } catch (error) {
      console.error("Error retrieving child evaluations: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Retrieves messages for the parent
   * @async
   * @function getMessages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with status and messages
   */
  async getMessages(req, res) {
    try {
      const parentId = req.user.id; // Assuming the parent ID is stored in req.user.id
      const messages = await ParentService.getMessagesByParentId(parentId);
      return res.status(200).json({ messages });
    } catch (error) {
      console.error("Error retrieving messages: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Posts a message from the parent
   * @async
   * @function postMessage
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.content - Content of the message
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with status and message
   */
  async postMessage(req, res) {
    try {
      const { content } = req.body;
      const parentId = req.user.id; // Assuming the parent ID is stored in req.user.id

      if (!content) return res.status(400).json({ message: "Content is required" });

      await ParentService.postMessage(parentId, content);
      return res.status(201).json({ message: "Message posted successfully" });
    } catch (error) {
      console.error("Error posting message: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Retrieves messages between a specific child and teacher
   * @async
   * @function getMessagesByChildAndTeacher
   * @param {Object} req - Express request object
   * @param {string} req.params.childId - ID of the child
   * @param {string} req.params.teacherId - ID of the teacher
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with status and messages
   */
  async getMessagesByChildAndTeacher(req, res) {
    try {
      const { childId, teacherId } = req.params;
      const messages = await ParentService.getMessagesByChildAndTeacher(childId, teacherId);
      return res.status(200).json({ messages });
    } catch (error) {
      console.error("Error retrieving messages by child and teacher: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ParentController();