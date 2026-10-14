const express = require('express');
const router = express.Router();
const quizController = require('./quiz.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

router.use(authenticateToken, authorizeRoles('STUDENT'));

router.get('/', quizController.getQuizzes);

module.exports = router;