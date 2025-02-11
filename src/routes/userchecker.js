const express = require('express'); // Import the express module
const User = require('../../classes/users.js'); // Import the User class from the specified path

const router = express.Router(); // Create a new router object

// Define a route to get the details of the current user
router.get('/users/me', async (req, res) => {
    try {
        // Fetch the details of the user with ID 1
        const user = await User.fetchUserDetails(1); // Change this to the user ID you want to fetch; for now, we are fetching user with ID 1
        res.json(user); // Send the user details as a JSON response
    } catch (err) {
        // If an error occurs, send a 500 status code and the error message as a JSON response
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Export the router object so it can be used in other parts of the application