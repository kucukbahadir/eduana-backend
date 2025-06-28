const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');
const { authenticateUser } = require("../middelware/authMiddleware");
const { hasRole } = require('../middelware/rbacMiddlewares');

router.get('/:classId/students', authenticateUser, hasRole(["TEACHER", "STUDENT"]), (req, res) => ClassController.getStudentsByClassId(req, res));
router.get('/:classId', /*authenticateUser,*/ (req, res) => ClassController.getClassById(req, res));
router.get('/teacher/:teacherId', /*authenticateUser, hasRole("TEACHER"),*/ (req, res) => ClassController.getClassesByTeacherId(req, res));

module.exports = router;