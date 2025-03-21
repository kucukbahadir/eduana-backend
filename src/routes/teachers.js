const express = require("express");
const TeacherController = require("../controllers/teacherController");
const { authenticateUser } = require("../middelware/authMiddleware");
const { hasRole } = require("../middelware/rbacMiddlewares");

const router = express.Router();

router.get("/:teacherId/classes", authenticateUser, hasRole(["ADMIN", "TEACHER"]), (req, res) => TeacherController.getClasses(req, res));
router.get("/:teacherId/students", authenticateUser, hasRole(["ADMIN", "TEACHER"]), (req, res) => TeacherController.getStudents(req, res));

module.exports = router;