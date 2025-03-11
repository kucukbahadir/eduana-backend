const UserService = require("../services/userService");
const jwt = require('jsonwebtoken');

class UserController {
     async getUserDetails(req, res) {
        try {
            // Extract the token from the authorization header
            const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
                ? req.headers.authorization.split(' ')[1]
                : null;

            // If no token is provided or the token is malformed, return a 401 error
            if (!token) {
                return res.status(401).json({ error: 'No token provided or token is malformed' });
            }

            // Verify the token using the secret key, but catch JWT-specific errors
            const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';
            let decodedToken;

            try {
                decodedToken = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            // Extract the user ID from the decoded token
            const userId = decodedToken.userId;

            // Fetch user details using the user ID
            const user = await UserService.fetchUserDetails(userId);

            // Return the user details in the response
            return res.status(200).json(user);

        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
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

     async loginUser(req, res) {
        try {
            const userType = req.params.userType;
            const credentials = req.body;

            const response = await UserService.authenticateUser(userType, credentials);

            if (!response.success || !response.user) {
                console.log(response.message);
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            // Generate JWT token with user ID
            const token = jwt.sign(
                { userId: response.user.id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "2h" }
            );

            return res.json({
                success: true,
                message: "Login successful",
                token,
                redirect: response.redirect  // Include redirect URL
            });

        } catch (error) {
            console.error(`Login failed for userType: ${req.params.userType}`, error.message);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

module.exports = new UserController();