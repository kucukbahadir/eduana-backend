const express = require("express");
const TeacherController = require("../controllers/teacherController");
const EvaluationController = require("../controllers/evaluationController");
const { authenticateUser } = require("../middelware/authMiddleware");
const { hasRole } = require("../middelware/rbacMiddlewares");

const router = express.Router();

router.get("/classes", authenticateUser, hasRole(["ADMIN", "TEACHER"]), (req, res) => TeacherController.getClasses(req, res));
router.get("students", authenticateUser, hasRole(["ADMIN", "TEACHER"]), (req, res) => TeacherController.getStudents(req, res));
router.get("/courses", authenticateUser, hasRole(["TEACHER"]), ( req, res) => TeacherController.getAllCourses(req, res));

router.post("/sessions/:sessionId/evaluation", (req, res) => {EvaluationController.submitEvaluation(req, res)});
module.exports = router;