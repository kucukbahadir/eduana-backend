// controllers/userController.js
const UserService = require("../services/userService");

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    loginUser = async (req, res) => {
        try {
            const userType = req.params.userType;
            const credentials = req.body;

            const response = await this.userService.authenticateUser(userType, credentials);
            if (response.success) {
                console.log(`User authenticated successfully: ${userType}`);
            }
            else {
                console.log(response.message);
                console.log(`Login failed for userType: ${req.params.userType}`)
            }

            return res.json(response);
        } catch (error) {
            console.error(`Login failed for userType: ${req.params.userType}`, error.message);

            // Always return JSON even on errors
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    };

}

// Export an instance of the class
module.exports = new UserController(UserService);
