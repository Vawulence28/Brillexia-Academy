const quizService = require('./quiz.service');

class QuizController {
  async getQuizzes(req, res, next) {
    try {
      const quizzes = await quizService.getQuizzes(req.user.userId);
      res.status(200).json({ success: true, data: quizzes });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new QuizController();