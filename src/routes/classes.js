const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');
const { authenticateUser } = require("../middelware/authMiddleware");

router.get('/:classId/students', (req, res) => ClassController.getStudentsByClassId(req, res));

// router.get('/classes/:classId/students', authenticateUser, (req, res) => StudentController.getStudentsByClassId(req, res));

module.exports = router;