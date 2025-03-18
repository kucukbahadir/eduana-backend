const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => authController.loginUser(req, res))
router.post("/register/:userType", (req, res) => authController.registerUser(req, res))

router.post("/reset-password", (req, res) => authController.requestPasswordReset(req, res))
router.put("/update-password/:token", (req, res) => authController.changePassword(req, res))

module.exports = router;