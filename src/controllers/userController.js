const UserService = require("../services/userService");
const logger = require("../utils/logger");
const { UserType } = require("@prisma/client");

class UserController {
  /**
   * Retrieves a user by their ID
   *
   * @async
   * @function getUser
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - User ID to retrieve
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with user data or error message
   * @throws {Error} When database operation fails
   */
  async getUser(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ error: "User ID not provided" });

      const user = await UserService.findById(parseInt(userId));
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Changes the role of a user.
   * @param {Object} req - The request object.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.newRole - The new role to assign to the user.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.userId - The ID of the user whose role is being changed.
   * @param {Object} res - The response object.
   * @returns {Object} The updated user object on success, or an error message on failure.
   * @throws {Error} When there's an issue updating the user role.
   */
  async updateRole(req, res) {
    try {
      const { newRole } = req.body;
      const { userId } = req.params;

      if (!newRole) return res.status(400).json({ error: "New role is required" });
      if (!Object.values(UserType).includes(newRole)) return res.status(400).json({ error: "Invalid role" });

      if (!userId) return res.status(400).json({ error: "User ID is required" });
      const userExists = await UserService.findById(parseInt(userId));
      if (!userExists) return res.status(404).json({ error: "User not found" });

      const updatedUser = await UserService.updateRole(parseInt(userId), newRole);

      logger.info(`User role updated: ${updatedUser.id} -> ${updatedUser.role}`);
      return res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Error updating user role:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new UserController();
