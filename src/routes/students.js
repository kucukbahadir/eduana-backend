const express = require('express');
const { authenticateUser } = require("../middelware/authMiddleware");
const { hasRole } = require("../middelware/rbacMiddlewares");
const StudentController = require("../controllers/studentController");

const router = express.Router();

router.get("/progress", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentProgress(req, res)});
router.get("/summary", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentSummary(req, res)});
router.get("/next-keywords", authenticateUser, hasRole("STUDENT"),(req,res) => {StudentController.getStudentNextKeywords(req, res)});

router.get("/classes", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentClasses(req, res)});
router.get("/class/:classId", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentClass(req, res)});

router.get("/sessions", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentSessions(req, res)});
router.get("/session/:sessionId", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentSession(req, res)});

router.get("/announcements", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentAnnouncements(req, res)});

router.get("/evaluations", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentEvaluations(req, res)});
router.get("/evaluation/:evaluationId", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentEvaluation(req, res)});

router.post("/keyword-progress", authenticateUser,hasRole("STUDENT"), (req, res) => {StudentController.postStudentKeywordProgress(req, res)});
router.post("/flush-progress", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.flushStudentProgress(req, res)} );
router.post("/game-session", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.postGameSession(req, res)});

router.patch("/game-session/:sessionId", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.patchGameSession(req, res)});

module.exports = router;
