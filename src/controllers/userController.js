const UserService = require("../services/userService");
const jwt = require('jsonwebtoken');

class UserController {
    static async getUserDetails(req, res) {
        try {
            // Uncomment this code block to generate a JWT token for testing purposes
            // const testUserId = 1;
            // const hushKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';
            // const testToken = jwt.sign({ userId: testUserId }, hushKey, { expiresIn: '1h' });
            // console.log(`Test JWT Token: ${testToken}`);
            // req.headers.authorization = `Bearer ${testToken}`;

            // Extract the token from the authorization header if it exists
            const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;

            // If no token is provided or the token is malformed, return a 401 error
            if (!token) {
                return res.status(401).json({ error: 'No token provided or token is malformed' });
            }

            // Verify the token using the secret key
            const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';
            const decodedToken = jwt.verify(token, secretKey);

            // Extract the user ID from the decoded token
            const userId = decodedToken.userId;

            // Fetch user details using the user ID
            const user = await UserService.fetchUserDetails(userId);

            // Return the user details in the response
            res.status(200).json(user);
        } catch (err) {
            // If an error occurs, return a 500 error with the error message
            res.status(500).json({ error: err.message });
        }
    }

    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;

            await UserService.requestPasswordReset(email);

            console.log(`Password reset requested for: ${email}`);
            return res.status(200).json({ message: `Password reset confirmation sent to: ${email}` });
        } catch (error) {
            console.error('Reset password request error: ', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async changePassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            await UserService.changePassword(token, password);

            console.log('Password changed successfully');
            return res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error('Update password error: ', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
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

module.exports = new UserController();