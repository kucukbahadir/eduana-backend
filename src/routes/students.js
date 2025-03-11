const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const {authenticateUser} = require("../middelware/authMiddleware");
const {
    adminMiddleware,
    teacherMiddleware,
    coordinatorMiddleware
} = require("../middelware/rbacMiddlewares");

router.get('/teacher/class/students', authenticateUser, teacherMiddleware, (req, res) => StudentController.getStudentsByClassId(req, res));
router.get('/admin/class/students', authenticateUser, adminMiddleware, (req, res) => StudentController.getStudentsByClassId(req, res));
router.get('/coordinator/class/students', authenticateUser, coordinatorMiddleware, (req, res) => StudentController.getStudentsByClassId(req, res));

module.exports = router;