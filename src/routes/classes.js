const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');
const { authenticateUser } = require("../middelware/authMiddleware");
const { hasRole } = require('../middelware/rbacMiddlewares');

router.get('/:classId/students', authenticateUser, (req, res) => ClassController.getStudentsByClassId(req, res));

module.exports = router;