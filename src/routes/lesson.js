const express = require('express');
const router = express.Router();
const LessonController = require('../controllers/lessonController');

router.get('/:teacherId/lesson/next', (req, res) => LessonController.getNextLesson(req, res));


module.exports = router;