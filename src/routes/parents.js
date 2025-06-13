const express = require('express');
const { authenticateUser } = require("../middelware/authMiddleware");
const { hasRole } = require("../middelware/rbacMiddlewares");
const ParentController = require("../controllers/parentController");

const router = express.Router();

router.get("/children", authenticateUser, hasRole("PARENT"), (req, res) => {
    ParentController.getChildren(req, res);
});
router.get("/attendance/:childId", authenticateUser, hasRole("PARENT"), (req, res) => {
    ParentController.getChildAttendance(req, res);
});
router.get("/evaluations/:childId", authenticateUser, hasRole("PARENT"), (req, res) => {
    ParentController.getChildEvaluations(req, res);
});
router.get("/messages", authenticateUser, hasRole("PARENT"), (req, res) => {
    ParentController.getMessages(req, res);
});
router.post("/message", authenticateUser, hasRole("PARENT"), (req, res) => {
    ParentController.postMessage(req, res);
});
router.get("/messages/:childId/:teacherId", authenticateUser, hasRole("PARENT"), (req, res) => { 
    ParentController.getMessagesByChildAndTeacher(req, res);
});

module.exports = router;