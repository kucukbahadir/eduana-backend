const CoordinatorService = require("../services/coordinatorService");
const UserService = require("../services/userService");

class CoordinatorController {
  /**
   * Creates a coordinator profile with the provided information
   * 
   * @async
   * @function createCoordinatorProfile
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing coordinator information
   * @param {string} req.body.email - Coordinator's email address
   * @param {string} req.body.phoneNumber - Coordinator's phone number
   * @param {string} req.body.userId - ID of the user to associate with the coordinator profile
   * @param {Object} res - Express response object
   * @returns {Object} 201 status with success message if created successfully
   * @returns {Object} 400 status with error message if required fields are missing or invalid
   * @returns {Object} 404 status with error message if the user is not found
   * @returns {Object} 500 status with error message if server error occurs
   * @throws {Error} When there is an issue creating the coordinator profile
   */
  async createCoordinatorProfile(req, res) {
    try {
      const { email, phoneNumber, userId } = req.body;
  
      if (!phoneNumber) return res.status(400).json({ message: "Phone number is required" });
      if (!userId) return res.status(400).json({ message: "User ID is required" });
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) return res.status(400).json({ message: "Email is required" });
      if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email address" });

      const coordinator = await UserService.findById(userId);
      if (!coordinator) return res.status(404).json({ message: "User not found" });

      await CoordinatorService.createCoordinatorProfile(email, phoneNumber, userId);
      return res.status(201).json({ message: "Coordinator profile created successfully" });
    } catch (error) {
      console.error("Error creating coordinator profile: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new CoordinatorController();