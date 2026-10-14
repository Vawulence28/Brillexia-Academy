const db = require('../../config/db');

class InstructorService {
  async getInstructorIdByUserId(userId) {
    const res = await db.query('SELECT instructor_id FROM ba_instructors WHERE user_id = $1', [userId]);
    if (res.rows.length === 0) {
      throw { statusCode: 404, message: 'Instructor profile not found for this user account.' };
    }
    return res.rows[0].instructor_id;
  }

  async getDashboardData(userId) {
    const instructorId = await this.getInstructorIdByUserId(userId);

    const studentsRes = await db.query(
      `SELECT DISTINCT s.student_id, u.first_name, u.last_name, u.email, s.grade_level
       FROM ba_lessons l
       JOIN ba_students s ON l.student_id = s.student_id
       JOIN ba_users u ON s.user_id = u.user_id
       WHERE l.instructor_id = $1`,
      [instructorId]
    );

    const lessonsRes = await db.query(
      `SELECT l.*, su.first_name AS student_first, su.last_name AS student_last, c.title AS course_title
       FROM ba_lessons l
       JOIN ba_students s ON l.student_id = s.student_id
       JOIN ba_users su ON s.user_id = su.user_id
       LEFT JOIN ba_courses c ON l.course_id = c.course_id
       WHERE l.instructor_id = $1 AND l.scheduled_start >= CURRENT_TIMESTAMP
       ORDER BY l.scheduled_start ASC LIMIT 5`,
      [instructorId]
    );

    const gradingRes = await db.query(
      `SELECT sub.*, a.title AS assignment_title, su.first_name AS student_first, su.last_name AS student_last
       FROM ba_submissions sub
       JOIN ba_assignments a ON sub.assignment_id = a.assignment_id
       JOIN ba_students s ON sub.student_id = s.student_id
       JOIN ba_users su ON s.user_id = su.user_id
       WHERE a.course_id IN (
         SELECT DISTINCT course_id FROM ba_lessons WHERE instructor_id = $1 AND course_id IS NOT NULL
       ) AND sub.grade IS NULL`,
      [instructorId]
    );

    return {
      assignedStudentsCount: studentsRes.rows.length,
      assignedStudents: studentsRes.rows,
      upcomingLessons: lessonsRes.rows,
      pendingGrading: gradingRes.rows
    };
  }

  async getAssignedStudents(userId) {
    const instructorId = await this.getInstructorIdByUserId(userId);
    const res = await db.query(
      `SELECT DISTINCT s.student_id, u.first_name, u.last_name, u.email, u.phone, s.grade_level, s.learning_goals
       FROM ba_lessons l
       JOIN ba_students s ON l.student_id = s.student_id
       JOIN ba_users u ON s.user_id = u.user_id
       WHERE l.instructor_id = $1`,
      [instructorId]
    );
    return res.rows;
  }

  async getSchedule(userId) {
    const instructorId = await this.getInstructorIdByUserId(userId);
    const res = await db.query(
      `SELECT l.*, su.first_name AS student_first, su.last_name AS student_last, c.title AS course_title
       FROM ba_lessons l
       JOIN ba_students s ON l.student_id = s.student_id
       JOIN ba_users su ON s.user_id = su.user_id
       LEFT JOIN ba_courses c ON l.course_id = c.course_id
       WHERE l.instructor_id = $1
       ORDER BY l.scheduled_start DESC`,
      [instructorId]
    );
    return res.rows;
  }

  async scheduleLesson(userId, lessonData) {
    const instructorId = await this.getInstructorIdByUserId(userId);
    const { studentId, courseId, title, description, scheduledStart, scheduledEnd, meetingProvider, meetingUrl } = lessonData;

    if (!studentId || !scheduledStart || !scheduledEnd || !title) {
      throw { statusCode: 400, message: 'Missing required lesson fields.' };
    }

    const conflictCheck = await db.query(
      `SELECT lesson_id FROM ba_lessons 
       WHERE instructor_id = $1 AND status != 'CANCELLED'
       AND ((scheduled_start <= $2 AND scheduled_end > $2) OR (scheduled_start < $3 AND scheduled_end >= $3) OR (scheduled_start >= $2 AND scheduled_end <= $3))`,
      [instructorId, scheduledStart, scheduledEnd]
    );

    if (conflictCheck.rows.length > 0) {
      throw { statusCode: 409, message: 'Scheduling conflict: Instructor already has a lesson during this time window.' };
    }

    const res = await db.query(
      `INSERT INTO ba_lessons (student_id, instructor_id, course_id, title, description, scheduled_start, scheduled_end, meeting_provider, meeting_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'SCHEDULED') RETURNING *`,
      [studentId, instructorId, courseId || null, title, description || '', scheduledStart, scheduledEnd, meetingProvider || 'GOOGLE_MEET', meetingUrl || '']
    );

    return res.rows[0];
  }
}

module.exports = new InstructorService();