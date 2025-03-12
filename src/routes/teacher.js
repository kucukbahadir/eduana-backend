const express = require('express');
const router = express.Router();
const {authenticateUser} = require("../middelware/authMiddleware");
const {validateTeacherId} = require("../middelware/validateMiddleware")
const TeacherController = require("../controllers/teacherController");

router.get('/{id}/classes', authenticateUser, validateTeacherId,(req, res)=> TeacherController.getClassByTeacherId(req, res) )
module.exports = router;