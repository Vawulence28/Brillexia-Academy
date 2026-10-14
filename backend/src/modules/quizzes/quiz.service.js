const db = require('../../config/db');

class QuizService {
  async getQuizzes(userId) {
    const studentRes = await db.query('SELECT student_id FROM ba_students WHERE user_id = $1', [userId]);
    if (studentRes.rows.length === 0) throw { statusCode: 404, message: 'Student not found' };
    const studentId = studentRes.rows[0].student_id;

    const res = await db.query(
      `SELECT q.*, c.title AS course_title, qa.score, qa.completed_at
       FROM ba_quizzes q
       JOIN ba_courses c ON q.course_id = c.course_id
       LEFT JOIN ba_quiz_attempts qa ON q.quiz_id = qa.quiz_id AND qa.student_id = $1
       WHERE q.course_id IN (SELECT course_id FROM ba_student_enrolments WHERE student_id = $1)`,
      [studentId]
    );
    return res.rows;
  }
}

module.exports = new QuizService();