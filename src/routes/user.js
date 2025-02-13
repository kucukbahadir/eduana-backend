const express = require('express'); // Import the express module
const User = require('../../classes/users.js'); // Import the User class from the specified path
const { getUserIdByToken } = require('../middelware/authMiddleware.js'); // Import the getUserIdByToken function
const jwt = require('jsonwebtoken');

const router = express.Router(); // Create a new router object

// Define a route to get the details of the current user
router.get('/users', async (req, res) => {
    try {
        
        // Create a JWT token for testing purposes
        // uncomment to test
//____________________________________________________________________________________________________
        // const testUserId = 1;
        // const hushKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';
        // const testToken = jwt.sign({ userId: testUserId }, hushKey, { expiresIn: '1h' });
        // console.log(`Test JWT Token: ${testToken}`);
        // req.headers.authorization = `Bearer ${testToken}`;
//____________________________________________________________________________________________________    
        
        const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
        if (!token) {
            return res.status(401).json({ error: 'No token provided or token is malformed' });
        }
        const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey'; // Use the environment variable or a default key
        const decodedToken = jwt.verify(token, secretKey); // Verify the token and decode it
        const userId = decodedToken.userId; // Get the user ID from the decoded token
        const user = await User.fetchUserDetails(userId); // Fetch the user details using the user ID
        res.status(200).json(user); // Send the user details as a JSON response
    } catch (err) {
        // If an error occurs, send a 500 status code and the error message as a JSON response
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Export the router object so it can be used in other parts of the application