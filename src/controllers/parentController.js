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
}

module.exports = new ParentController();