const express = require('express');
const router = express.Router();

router.get('/reset-password/', (req, res) => {
    // TODO: request reset token
    
    // TODO: send email with reset token
});

router.get('/update-password/:token', (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    return res.status(200).json({ message: `Token inputted: ${token}` });

    // TODO: verify reset token
    
    // TODO: update user password
});

module.exports = router;