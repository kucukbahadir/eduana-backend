const express = require('express');
const router = express.Router();

router.use('/curricula', require('./curricula'));
router.use('/classes', require('./classes'));
router.use('/sessions', require('./sessions'));
router.use('/teachers', require('./teachers'));
router.use('/students', require('./students'));
router.use('/announcements', require('./announcements'));
router.use('/session-evaluations', require('./sessionEvaluations'));
router.use('/final-evaluations', require('./finalEvaluations'));



module.exports = router;