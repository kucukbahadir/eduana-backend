const express = require('express'); // Import the express module
const User = require('../../classes/users.js'); // Import the User class from the specified path
const { getUserIdByToken } = require('../middelware/authMiddleware.js'); // Import the getUserIdByToken function
const jwt = require('jsonwebtoken');

const router = express.Router(); // Create a new router object

// Create a JWT token for testing purposes




// Define a route to get the details of the current user
router.get('/users/me', async (req, res) => {
    try {
        const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey'; // Use a default key if the environment variable is not set
        const testToken = jwt.sign({ userId: 1 }, secretKey, { expiresIn: '1h' });
        console.log("Test JWT Token:", testToken);
        const userId = await getUserIdByToken(testToken); // Get the user ID from the token
        const user = await User.fetchUserDetails(userId); // Fetch the user details using the user ID
        res.json(user); // Send the user details as a JSON response
    } catch (err) {
        // If an error occurs, send a 500 status code and the error message as a JSON response
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Export the router object so it can be used in other parts of the application