const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const {authenticateUser} = require("../middelware/authMiddleware");
const {validateClassId} = require("../middelware/validateMiddleware")
const {
    teacherMiddleware,
} = require("../middelware/rbacMiddlewares");

router.get('/classes/:classId/students', authenticateUser, validateClassId, (req, res) => StudentController.getStudentsByClassId(req, res));
router.get('/teacher/:teacherId', authenticateUser, teacherMiddleware, (req, res) => StudentController.getStudentsByTeacherId(req, res));
module.exports = router;