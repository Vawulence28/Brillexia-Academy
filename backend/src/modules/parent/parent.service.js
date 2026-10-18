const db = require('../../config/db');

class ParentService {
  async getParentIdByUserId(userId) {
    const res = await db.query('SELECT parent_id FROM ba_parents WHERE user_id = $1', [userId]);
    if (res.rows.length === 0) {
      throw { statusCode: 404, message: 'Parent profile not found for this user account.' };
    }
    return res.rows[0].parent_id;
  }

  async verifyParentChild(parentId, studentId) {
    const res = await db.query(
      `SELECT relationship_id FROM ba_parent_students WHERE parent_id = $1 AND student_id = $2 AND verified = TRUE`,
      [parentId, studentId]
    );
    if (res.rows.length === 0) {
      throw { statusCode: 403, message: 'Unauthorized: You do not have verified guardianship access to this student record.' };
    }
  }

  async getLinkedChildren(userId) {
    const parentId = await this.getParentIdByUserId(userId);
    const res = await db.query(
      `SELECT s.student_id, u.first_name, u.last_name, u.email, s.grade_level, s.learning_goals
       FROM ba_parent_students ps
       JOIN ba_students s ON ps.student_id = s.student_id
       JOIN ba_users u ON s.user_id = u.user_id
       WHERE ps.parent_id = $1 AND ps.verified = TRUE`,
      [parentId]
    );
    return res.rows || [];
  }

  async getChildDashboard(userId, studentId) {
    const parentId = await this.getParentIdByUserId(userId);

    const verifyRes = await db.query(
      `SELECT * FROM ba_parent_students WHERE parent_id = $1 AND student_id = $2`,
      [parentId, studentId]
    );
    if (verifyRes.rows.length === 0) {
      throw { statusCode: 403, message: 'Unauthorized access to this student profile.' };
    }

    const studentRes = await db.query(
      `SELECT s.*, u.first_name, u.last_name, u.email, u.phone 
       FROM ba_students s JOIN ba_users u ON s.user_id = u.user_id 
       WHERE s.student_id = $1`,
      [studentId]
    );

    const assignmentsRes = await db.query(
      `SELECT a.*, c.title AS course_title, sub.submission_id, sub.grade, sub.file_url, sub.submitted_at
       FROM ba_assignments a
       JOIN ba_courses c ON a.course_id = c.course_id
       LEFT JOIN ba_submissions sub ON a.assignment_id = sub.assignment_id AND sub.student_id = $1
       WHERE a.course_id IN (SELECT course_id FROM ba_student_enrolments WHERE student_id = $1)
       ORDER BY a.due_date ASC`,
      [studentId]
    );

    const lessonsRes = await db.query(
      `SELECT l.*, iu.first_name AS instructor_first, iu.last_name AS instructor_last, c.title AS course_title
       FROM ba_lessons l
       JOIN ba_instructors i ON l.instructor_id = i.instructor_id
       JOIN ba_users iu ON i.user_id = iu.user_id
       LEFT JOIN ba_courses c ON l.course_id = c.course_id
       WHERE l.student_id = $1
       ORDER BY l.scheduled_start DESC`,
      [studentId]
    );

    const coursesRes = await db.query(
      `SELECT c.*, se.status AS enrolment_status, se.enrolled_at
       FROM ba_student_enrolments se
       JOIN ba_courses c ON se.course_id = c.course_id
       WHERE se.student_id = $1`,
      [studentId]
    );

    return {
      profile: studentRes.rows[0] || null,
      assignments: assignmentsRes.rows || [],
      upcomingLessons: lessonsRes.rows || [],
      enrolledCourses: coursesRes.rows || []
    };
  }

  async getChildSchedule(userId, studentId) {
    const parentId = await this.getParentIdByUserId(userId);
    await this.verifyParentChild(parentId, studentId);

    const res = await db.query(
      `SELECT l.*, iu.first_name AS instructor_first, iu.last_name AS instructor_last, c.title AS course_title
       FROM ba_lessons l
       JOIN ba_instructors i ON l.instructor_id = i.instructor_id
       JOIN ba_users iu ON i.user_id = iu.user_id
       LEFT JOIN ba_courses c ON l.course_id = c.course_id
       WHERE l.student_id = $1 ORDER BY l.scheduled_start DESC`,
      [studentId]
    );
    return res.rows || [];
  }

  async getChildAttendance(userId, studentId) {
    const parentId = await this.getParentIdByUserId(userId);
    await this.verifyParentChild(parentId, studentId);

    const res = await db.query(
      `SELECT att.*, l.title AS lesson_title, l.scheduled_start, iu.first_name AS instructor_first, iu.last_name AS instructor_last
       FROM ba_attendance att
       JOIN ba_lessons l ON att.lesson_id = l.lesson_id
       JOIN ba_instructors i ON l.instructor_id = i.instructor_id
       JOIN ba_users iu ON i.user_id = iu.user_id
       WHERE l.student_id = $1 ORDER BY l.scheduled_start DESC`,
      [studentId]
    );
    return res.rows || [];
  }

  async getChildResults(userId, studentId) {
    const parentId = await this.getParentIdByUserId(userId);
    await this.verifyParentChild(parentId, studentId);

    const res = await db.query(
      `SELECT a.*, c.title AS course_title, sub.grade, sub.instructor_feedback, sub.submitted_at
       FROM ba_assignments a
       JOIN ba_courses c ON a.course_id = c.course_id
       JOIN ba_submissions sub ON a.assignment_id = sub.assignment_id
       WHERE sub.student_id = $1 AND sub.grade IS NOT NULL ORDER BY sub.submitted_at DESC`,
      [studentId]
    );
    return res.rows || [];
  }

  async getChildCertificates(userId, studentId) {
    const parentId = await this.getParentIdByUserId(userId);
    await this.verifyParentChild(parentId, studentId);

    const res = await db.query(
      `SELECT cert.*, c.title AS course_title FROM ba_certificates cert
       JOIN ba_courses c ON cert.course_id = c.course_id WHERE cert.student_id = $1`,
      [studentId]
    );
    return res.rows || [];
  }
}

module.exports = new ParentService();