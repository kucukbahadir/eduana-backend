const express = require("express");
const TeacherController = require("../controllers/teacherController");
const EvaluationController = require("../controllers/evaluationController");
const { authenticateUser } = require("../middelware/authMiddleware");
const { hasRole } = require("../middelware/rbacMiddlewares");
const classController = require("../controllers/classController");

const router = express.Router();

// router.get("/classes", authenticateUser,hasRole( "TEACHER"), (req, res) => TeacherController.getClasses(req, res));
router.get("/:teacherId/classes", /* authenticateUser, hasRole("TEACHER"), */ (req, res) => classController.getClassesByTeacherId(req, res));
router.get("/students", authenticateUser,hasRole( "TEACHER"), (req, res) => TeacherController.getStudents(req, res));
router.get("/courses",authenticateUser, hasRole( "TEACHER"), ( req, res) => TeacherController.getAllCourses(req, res));

router.post("/sessions/:sessionId/evaluation",authenticateUser, hasRole( "TEACHER"), (req, res) => {EvaluationController.submitEvaluation(req, res)});
module.exports = router;