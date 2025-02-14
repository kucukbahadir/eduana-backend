const UserService = require('../services/userService');
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
}

module.exports = UserController;