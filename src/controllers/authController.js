const AuthService = require("../services/authService");
const UserService = require("../services/userService");
const { UserType } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const StudentController = require("./studentController");
const ParentController = require("./parentController");
const TeacherController = require("./teacherController");
const CoordinatorController = require("./coordinatorController");
const AdminController = require("./adminController");
const SALT_ROUNDS = 10;

class AuthController {
  /**
   * Authenticates a user and generates a JWT token for authorization.
   * 
   * @async
   * @function loginUser
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.username - User's username
   * @param {string} req.body.password - User's password
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with token and redirect URL
   * @throws {Error} When there's an issue with the authentication process
   * 
   * @description
   * This function validates user credentials, determines the appropriate 
   * redirect URL based on the user's role, and generates a JWT token for 
   * authenticated sessions. The token contains the user ID and role.
   * 
   * Possible HTTP responses:
   * - 200: Login successful with token and redirect URL
   * - 400: Missing username/password or invalid user type
   * - 401: Invalid credentials
   * - 500: Server error
   */
  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      let redirect = null;

      if (!username) return res.status(400).json({ message: "Username is required" });
      if (!password) return res.status(400).json({ message: "Password is required" });

      const user = await UserService.findByUsername(username);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      
      switch (user.role.toLowerCase()) {
        case "student": redirect = "/dashboard/student"; break;
        case "parent": redirect = "/dashboard/parent"; break;
        case "teacher": redirect = "/dashboard/teacher"; break;
        case "coordinator": redirect = "/dashboard/coordinator"; break;
        case "admin": redirect = "/dashboard/admin"; break;
        default: return res.status(400).json({ message: "Invalid user type" });
      }

      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2h" }
      );

      return res.status(200).json({ success: true, message: "Login successful", token, redirect });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  /**
   * Registers a new user in the system with their profile data
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing user information
   * @param {string} req.body.name - User's full name
   * @param {string} req.body.username - User's unique username
   * @param {string} req.body.password - User's password (will be hashed)
   * @param {Object} req.body.profileData - Additional profile data specific to user type
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.userType - Type of user to register (student, parent, teacher, coordinator, admin)
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} JSON response with success or error message
   * @throws {Error} If there's an internal server error during registration
   */
  async registerUser(req, res) {
    try {
      const { name, username, password, ...profileData } = req.body;
      const { userType } = req.params;

      if (!name) return res.status(400).json({ message: "Name is required" });

      if (!userType) return res.status(400).json({ message: "User type is required" });
      if (!Object.values(UserType).includes(userType.toUpperCase()))
        return res.status(400).json({ message: "Invalid user type" });

      if (!password) return res.status(400).json({ message: "Password is required" });
      if (userType.toLowerCase() != "student") {
        if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
        if (!/[A-Z]/.test(password)) return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
        if (!/[0-9]/.test(password)) return res.status(400).json({ message: "Password must contain at least one number" });
      }

      if (!username) return res.status(400).json({ message: "Username is required" });
      const usernameExists = await UserService.usernameExists(username);
      if (usernameExists) return res.status(400).json({ message: "Username already exists" });

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await AuthService.createUser(name, username, hashedPassword, userType.toUpperCase());
      const request = { body: { userId: user.id, ...profileData } };

      switch (userType.toLowerCase()) {
        case "student": await StudentController.createStudentProfile(request, res); break;
        case "parent": await ParentController.createParentProfile(request, res); break;
        case "teacher": await TeacherController.createTeacherProfile(request, res); break;
        case "coordinator": await CoordinatorController.createCoordinatorProfile(request, res); break;
        case "admin": await AdminController.createAdminProfile(request, res); break;
        default: return res.status(400).json({ message: "Invalid user type" });
      }

      // NOTE: No OK status is returned here because the profile creation method will handle it
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Handles user password reset requests by generating a reset token.
   *
   * @async
   * @param {Object} req - The request object from Express
   * @param {Object} req.body - The request body
   * @param {string} req.body.email - The email of the user requesting password reset
   * @param {Object} res - The response object from Express
   * @returns {Object} JSON response with success message or error
   * @throws {Error} If there is a server error during the process
   *
   * The method:
   * 1. Generates a unique reset token using crypto
   * 2. Sets a 1-hour expiration for the token
   * 3. Verifies the user exists
   * 4. Updates the user record with the reset token and expiry
   * 5. Sends a password reset email to the user
   */
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const token = crypto.randomUUID();
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
      const url = process.env.DEV_URL || "http://localhost:3000";

      const user = await UserService.findByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });

      await AuthService.updateResetToken(user.id, token, tokenExpiry);

      await AuthService.sendPasswordResetEmail(email, token, url);
      return res.status(200).json({ message: `Password reset confirmation sent to ${email}` });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Changes user password using a reset token
   * @async
   * @function changePassword
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.token - Password reset token
   * @param {Object} req.body - Request body
   * @param {string} req.body.password - New password
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with success message or error
   * @throws {Error} When an internal error occurs during password change
   */
  async changePassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password) return res.status(400).json({ message: "Password is required" });
      if (!token) return res.status(400).json({ message: "Token is required" });

      const user = await UserService.findByResetToken(token);
      if (!user) return res.status(404).json({ message: "Token not found" });
      if (new Date() > new Date(user.resetTokenExpiry)) return res.status(400).json({ message: "Token expired" });

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      await AuthService.resetPassword(user, hashedPassword);

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new AuthController();
