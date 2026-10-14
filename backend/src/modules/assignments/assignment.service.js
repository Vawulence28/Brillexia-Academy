const db = require('../../config/db');

class AssignmentService {
  async getAssignments(userId) {
    const studentRes = await db.query('SELECT student_id FROM ba_students WHERE user_id = $1', [userId]);
    if (studentRes.rows.length === 0) throw { statusCode: 404, message: 'Student not found' };
    const studentId = studentRes.rows[0].student_id;

    const res = await db.query(
      `SELECT a.*, c.title AS course_title, sub.submission_id, sub.file_url, sub.student_comment, sub.grade, sub.instructor_feedback, sub.submitted_at, sub.status AS submission_status
       FROM ba_assignments a
       JOIN ba_courses c ON a.course_id = c.course_id
       LEFT JOIN ba_submissions sub ON a.assignment_id = sub.assignment_id AND sub.student_id = $1
       WHERE a.course_id IN (SELECT course_id FROM ba_student_enrolments WHERE student_id = $1)
       ORDER BY a.due_date ASC`,
      [studentId]
    );
    return res.rows;
  }

  async submitAssignment(userId, assignmentId, fileUrl, studentComment) {
    const studentRes = await db.query('SELECT student_id FROM ba_students WHERE user_id = $1', [userId]);
    if (studentRes.rows.length === 0) throw { statusCode: 404, message: 'Student not found' };
    const studentId = studentRes.rows[0].student_id;

    // Check if submission exists
    const existing = await db.query(
      `SELECT submission_id FROM ba_submissions WHERE assignment_id = $1 AND student_id = $2`,
      [assignmentId, studentId]
    );

    if (existing.rows.length > 0) {
      const res = await db.query(
        `UPDATE ba_submissions SET file_url = $1, student_comment = $2, submitted_at = CURRENT_TIMESTAMP, status = 'SUBMITTED'
         WHERE assignment_id = $3 AND student_id = $4 RETURNING *`,
        [fileUrl, studentComment, assignmentId, studentId]
      );
      return res.rows[0];
    } else {
      const res = await db.query(
        `INSERT INTO ba_submissions (assignment_id, student_id, file_url, student_comment, status, submitted_at)
         VALUES ($1, $2, $3, $4, 'SUBMITTED', CURRENT_TIMESTAMP) RETURNING *`,
        [assignmentId, studentId, fileUrl, studentComment]
      );
      return res.rows[0];
    }
  }
}

module.exports = new AssignmentService();