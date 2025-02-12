// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// Define login route
router.post("/login/:userType", UserController.loginUser);

module.exports = router;
