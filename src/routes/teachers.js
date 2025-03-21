const express = require("express");
const TeacherController = require("../controllers/teacherController");

const router = express.Router();

router.get("/:teacherId/classes", (req, res) => TeacherController.getClasses(req, res));
router.get("/:teacherId/students", (req, res) => TeacherController.getStudents(req, res));

module.exports = router;