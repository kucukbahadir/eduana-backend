const express = require('express');
const User = require('../../classes/users.js');

const router = express.Router();

router.get('/users/me', async (req, res) => {
    try {
        const user = await User.fetchUserDetails(1); // Change this to the user ID you want to fetch; for now, we are fetching user with ID 1
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;