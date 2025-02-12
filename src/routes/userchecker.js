const express = require('express'); // Import the express module
const User = require('../../classes/users.js'); // Import the User class from the specified path
const { getUserIdByToken } = require('../middelware/authMiddleware.js'); // Import the getUserIdByToken function

const router = express.Router(); // Create a new router object

// Define a route to get the details of the current user
router.get('/users/me', async (req, res) => {
    try {
        
        const userId = await getUserIdByToken(req); // Get the user ID from the token
        const user = await User.fetchUserDetails(userId); // Fetch the user details using the user ID
        res.json(user); // Send the user details as a JSON response
    } catch (err) {
        // If an error occurs, send a 500 status code and the error message as a JSON response
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Export the router object so it can be used in other parts of the application