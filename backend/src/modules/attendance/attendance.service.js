const db = require('../../config/db');

class AttendanceService {
  async getAttendanceRecords(userId) {
    const instRes = await db.query('SELECT instructor_id FROM ba_instructors WHERE user_id = $1', [userId]);
    if (instRes.rows.length === 0) throw { statusCode: 404, message: 'Instructor not found' };
    const instructorId = instRes.rows[0].instructor_id;

    const res = await db.query(
      `SELECT att.*, l.title AS lesson_title, l.scheduled_start, su.first_name AS student_first, su.last_name AS student_last
       FROM ba_attendance att
       JOIN ba_lessons l ON att.lesson_id = l.lesson_id
       JOIN ba_students s ON l.student_id = s.student_id
       JOIN ba_users su ON s.user_id = su.user_id
       WHERE l.instructor_id = $1 ORDER BY l.scheduled_start DESC`,
      [instructorId]
    );
    return res.rows;
  }

  async markAttendance(userId, data) {
    const { lessonId, studentPresent, instructorPresent } = data;
    
    // Check if attendance record exists
    const check = await db.query('SELECT attendance_id FROM ba_attendance WHERE lesson_id = $1', [lessonId]);
    if (check.rows.length > 0) {
      const res = await db.query(
        `UPDATE ba_attendance SET student_present = $1, instructor_present = $2, updated_at = CURRENT_TIMESTAMP WHERE lesson_id = $3 RETURNING *`,
        [studentPresent, instructorPresent, lessonId]
      );
      return res.rows[0];
    } else {
      // Get scheduled duration from lesson
      const lessonRes = await db.query('SELECT scheduled_start, scheduled_end FROM ba_lessons WHERE lesson_id = $1', [lessonId]);
      if (lessonRes.rows.length === 0) throw { statusCode: 404, message: 'Lesson not found' };
      const l = lessonRes.rows[0];
      const durationMins = Math.round((new Date(l.scheduled_end) - new Date(l.scheduled_start)) / 60000);

      const res = await db.query(
        `INSERT INTO ba_attendance (lesson_id, student_present, instructor_present, scheduled_duration_minutes, verification_source)
         VALUES ($1, $2, $3, $4, 'MANUAL') RETURNING *`,
        [lessonId, studentPresent, instructorPresent, durationMins]
      );
      return res.rows[0];
    }
  }
}

module.exports = new AttendanceService();