const UserService = require("../services/userService");
const jwt = require('jsonwebtoken');

class UserController {
    async getUserDetails(req, res) {
        try {
            const userId = req.user.id

            // Fetch user details using the user ID
            const user = await UserService.fetchUserDetails(userId);

            // Return the user details in the response
            return res.status(200).json(user);

        } catch (err) {
            return res.status(500).json({error: 'Internal server error'});
        }
    }


    async requestPasswordReset(req, res) {
        try {
            const {email} = req.body;

            await UserService.requestPasswordReset(email);

            console.log(`Password reset requested for: ${email}`);
            return res.status(200).json({message: `Password reset confirmation sent to: ${email}`});
        } catch (error) {
            console.error('Reset password request error: ', error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async changePassword(req, res) {
        try {
            const {token} = req.params;
            const {password} = req.body;

            await UserService.changePassword(token, password);

            console.log('Password changed successfully');
            return res.status(200).json({message: 'Password changed successfully'});
        } catch (error) {
            console.error('Update password error: ', error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async loginUser(req, res) {
        try {
            const userType = req.params.userType;
            const credentials = req.body;

            const response = await UserService.authenticateUser(userType, credentials);

            if (!response.success || !response.user) {
                console.log(response.message);
                return res.status(401).json({success: false, message: "Invalid credentials"});
            }

            // Generate JWT token with user ID
            const token = jwt.sign(
                {userId: response.user.id},
                process.env.JWT_SECRET_KEY,
                {expiresIn: "2h"}
            );

            return res.json({
                success: true,
                message: "Login successful",
                token,
                redirect: response.redirect  // Include redirect URL
            });

        } catch (error) {
            console.error(`Login failed for userType: ${req.params.userType}`, error.message);
            return res.status(500).json({success: false, message: "Internal server error"});
        }
    }
}

module.exports = new UserController();