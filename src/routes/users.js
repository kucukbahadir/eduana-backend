const express = require("express");
const UserController = require("../controllers/UserController");
const { authenticateUser } = require("../middelware/authMiddleware");
const {
    adminMiddleware,
    teacherMiddleware,
    parentMiddleware,
    studentMiddleware,
    coordinatorMiddleware
} = require("../middelware/rbacMiddlewares");

const router = express.Router();

// Public routes (No authentication required)
router.post('/reset-password', (req, res) => UserController.requestPasswordReset(req, res));
router.put('/update-password/:token', (req, res) => UserController.changePassword(req, res));
router.post("/login/:userType", (req, res) => UserController.loginUser(req, res));

// Protected route (Only authenticated users can access)
router.get('/', authenticateUser, (req, res) => UserController.getUserDetails(req, res));

// Example: If only admins should fetch user details
// router.get('/', authenticateUser, adminMiddleware, (req, res) => UserController.getUserDetails(req, res));

// Example: Protecting a route for teachers only
// router.get('/teacher-dashboard', authenticateUser, teacherMiddleware, (req, res) => UserController.teacherDashboard(req, res));

module.exports = router;