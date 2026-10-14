const db = require('../../config/db');

class ReportService {
  async createReport(userId, reportData) {
    const instRes = await db.query('SELECT instructor_id FROM ba_instructors WHERE user_id = $1', [userId]);
    if (instRes.rows.length === 0) throw { statusCode: 404, message: 'Instructor not found' };
    const instructorId = instRes.rows[0].instructor_id;

    const { lessonId, studentId, topicCovered, learningObjectives, activitiesCompleted, comprehensionRating, challengesEncountered, homeworkAssigned, instructorRemarks } = reportData;

    const res = await db.query(
      `INSERT INTO ba_lesson_reports_extended (lesson_id, instructor_id, student_id, topic_covered, learning_objectives, activities_completed, comprehension_rating, challenges_encountered, homework_assigned, instructor_remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [lessonId, instructorId, studentId, topicCovered, learningObjectives, activitiesCompleted, comprehensionRating, challengesEncountered, homeworkAssigned, instructorRemarks]
    );

    return res.rows[0];
  }

  async getInstructorReports(userId) {
    const instRes = await db.query('SELECT instructor_id FROM ba_instructors WHERE user_id = $1', [userId]);
    if (instRes.rows.length === 0) throw { statusCode: 404, message: 'Instructor not found' };
    const instructorId = instRes.rows[0].instructor_id;

    const res = await db.query(
      `SELECT r.*, l.title AS lesson_title, su.first_name AS student_first, su.last_name AS student_last
       FROM ba_lesson_reports_extended r
       JOIN ba_lessons l ON r.lesson_id = l.lesson_id
       JOIN ba_students s ON r.student_id = s.student_id
       JOIN ba_users su ON s.user_id = su.user_id
       WHERE r.instructor_id = $1 ORDER BY r.created_at DESC`,
      [instructorId]
    );
    return res.rows;
  }
}

module.exports = new ReportService();