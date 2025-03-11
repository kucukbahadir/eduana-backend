const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const {authenticateUser} = require("../middelware/authMiddleware");
const {validateClassId} = require("../middelware/validateMiddleware")

router.get('/classes/:classId/students', authenticateUser, validateClassId, (req, res) => StudentController.getStudentsByClassId(req, res));

module.exports = router;