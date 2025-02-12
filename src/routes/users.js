const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/reset-password', (req, res) => UserController.requestPasswordReset(req, res));
router.put('/update-password/:token', (req, res) => UserController.changePassword(req, res));

module.exports = router;