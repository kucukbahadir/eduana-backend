const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/sessionController');

router.get('/:sessionId', (req, res) => SessionController.getSessionById(req, res));

router.post('/:sessionId/attendances', (req, res) => SessionController.postAttendances(req, res));
router.post('/:sessionId/evaluations', (req, res) => SessionController.postEvaluations(req, res));

module.exports = router;