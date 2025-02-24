const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/', (req, res) => UserController.getUserDetails(req, res));
router.post('/reset-password', (req, res) => UserController.requestPasswordReset(req, res));
router.put('/update-password/:token', (req, res) => UserController.changePassword(req, res));
router.post("/login/:userType",(req, res) => UserController.loginUser(req, res));

module.exports = router;