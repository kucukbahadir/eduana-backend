const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const {authenticateUser} = require("../middelware/authMiddleware");
const {
    adminMiddleware,
    teacherMiddleware,
    parentMiddleware,
    studentMiddleware,
    coordinatorMiddleware
} = require("../middelware/rbacMiddlewares");
router.get('/teacher/class/students', authenticateUser, teacherMiddleware, (req, res) => StudentController.getStudentsByClassId(req, res));

module.exports = router;