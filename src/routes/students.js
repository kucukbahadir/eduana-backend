const express = require('express');
const { authenticateUser } = require("../middelware/authMiddleware");
const { hasRole } = require("../middelware/rbacMiddlewares");
const StudentController = require("../controllers/StudentController");

const router = express.Router();

router.get("/progress", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentProgress(req, res)});
router.get("/summary", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.getStudentSummary(req, res)});
router.get("/next-keywords", authenticateUser, hasRole("STUDENT"),(req,res) => {StudentController.getStudentNextKeywords(req, res)});

router.post("/keyword-progress", authenticateUser,hasRole("STUDENT"), (req, res) => {StudentController.postStudentKeywordProgress(req, res)});
router.post("/flush-progress", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.flushStudentProgress(req, res)} );
router.post("/game-session", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.postGameSession(req, res)});
router.patch("/game-session/:sessionId", authenticateUser, hasRole("STUDENT"), (req, res) => {StudentController.patchGameSession(req, res)});

module.exports = router;
