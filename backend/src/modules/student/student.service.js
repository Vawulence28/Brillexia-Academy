const db = require('../../config/db');

class StudentService {
  async getStudentIdByUserId(userId) {
    const res = await db.query('SELECT student_id FROM ba_students WHERE user_id = $1', [userId]);
    if (res.rows.length === 0) {
      throw { statusCode: 404, message: 'Student profile not found for this user account.' };
    }
    return res.rows[0].student_id;
  }

  async getDashboardData(userId) {
    const studentId = await this.getStudentIdByUserId(userId);

    const studentRes = await db.query(
      `SELECT s.*, u.first_name, u.last_name, u.email, u.phone 
       FROM ba_students s JOIN ba_users u ON s.user_id = u.user_id 
       WHERE s.student_id = $1`,
      [studentId]
    );

    const lessonsRes = await db.query(
      `SELECT l.*, i.instructor_id, iu.first_name AS instructor_first, iu.last_name AS instructor_last, c.title AS course_title
       FROM ba_lessons l
       JOIN ba_instructors i ON l.instructor_id = i.instructor_id
       JOIN ba_users iu ON i.user_id = iu.user_id
       LEFT JOIN ba_courses c ON l.course_id = c.course_id
       WHERE l.student_id = $1 AND l.scheduled_start >= CURRENT_TIMESTAMP
       ORDER BY l.scheduled_start ASC LIMIT 5`,
      [studentId]
    );

    const coursesRes = await db.query(
      `SELECT c.*, se.status AS enrolment_status, se.enrolled_at
       FROM ba_student_enrolments se
       JOIN ba_courses c ON se.course_id = c.course_id
       WHERE se.student_id = $1`,
      [studentId]
    );

    // Fixed query to only select standard columns existing in ba_submissions
    const assignmentsRes = await db.query(
      `SELECT a.*, c.title AS course_title, sub.submission_id, sub.grade, sub.file_url, sub.submitted_at
       FROM ba_assignments a
       JOIN ba_courses c ON a.course_id = c.course_id
       LEFT JOIN ba_submissions sub ON a.assignment_id = sub.assignment_id AND sub.student_id = $1
       WHERE a.course_id IN (SELECT course_id FROM ba_student_enrolments WHERE student_id = $1)
       ORDER BY a.due_date ASC`,
      [studentId]
    );

    const certsRes = await db.query(
      `SELECT cert.*, c.title AS course_title FROM ba_certificates cert
       JOIN ba_courses c ON cert.course_id = c.course_id
       WHERE cert.student_id = $1`,
      [studentId]
    );

    return {
      profile: studentRes.rows[0],
      upcomingLessons: lessonsRes.rows,
      enrolledCourses: coursesRes.rows,
      assignments: assignmentsRes.rows,
      certificates: certsRes.rows
    };
  }

  async getLessons(userId) {
    const studentId = await this.getStudentIdByUserId(userId);
    const res = await db.query(
      `SELECT l.*, iu.first_name AS instructor_first, iu.last_name AS instructor_last, c.title AS course_title,
              att.student_present, att.instructor_present, att.verified_duration_minutes
       FROM ba_lessons l
       JOIN ba_instructors i ON l.instructor_id = i.instructor_id
       JOIN ba_users iu ON i.user_id = iu.user_id
       LEFT JOIN ba_courses c ON l.course_id = c.course_id
       LEFT JOIN ba_attendance att ON l.lesson_id = att.lesson_id
       WHERE l.student_id = $1
       ORDER BY l.scheduled_start DESC`,
      [studentId]
    );
    return res.rows;
  }

  async getAttendance(userId) {
    const studentId = await this.getStudentIdByUserId(userId);
    const res = await db.query(
      `SELECT att.*, l.title AS lesson_title, l.scheduled_start, iu.first_name AS instructor_first, iu.last_name AS instructor_last
       FROM ba_attendance att
       JOIN ba_lessons l ON att.lesson_id = l.lesson_id
       JOIN ba_instructors i ON l.instructor_id = i.instructor_id
       JOIN ba_users iu ON i.user_id = iu.user_id
       WHERE l.student_id = $1
       ORDER BY l.scheduled_start DESC`,
      [studentId]
    );
    return res.rows;
  }

  async getCourses(userId) {
    const studentId = await this.getStudentIdByUserId(userId);
    const res = await db.query(
      `SELECT c.*, se.status AS enrolment_status, se.enrolled_at
       FROM ba_student_enrolments se
       JOIN ba_courses c ON se.course_id = c.course_id
       WHERE se.student_id = $1`,
      [studentId]
    );
    return res.rows;
  }

  async getCertificates(userId) {
    const studentId = await this.getStudentIdByUserId(userId);
    const res = await db.query(
      `SELECT cert.*, c.title AS course_title FROM ba_certificates cert
       JOIN ba_courses c ON cert.course_id = c.course_id
       WHERE cert.student_id = $1`,
      [studentId]
    );
    return res.rows;
  }

  async updateProfile(userId, phone, learningGoals) {
    await db.query(
      `UPDATE ba_users SET phone = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`,
      [phone, userId]
    );
    const studentId = await this.getStudentIdByUserId(userId);
    if (learningGoals !== undefined) {
      await db.query(
        `UPDATE ba_students SET learning_goals = $1, updated_at = CURRENT_TIMESTAMP WHERE student_id = $2`,
        [learningGoals, studentId]
      );
    }
    return { success: true, message: 'Profile updated successfully.' };
  }
}

module.exports = new StudentService();