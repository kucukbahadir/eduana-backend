const express = require('express');
const User = require('./users.js');

const router = express.Router();

router.get('/user/1', async (req, res) => {
    try {
        const user = await User.fetchUserDetails(1);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;