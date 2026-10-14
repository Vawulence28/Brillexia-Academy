const db = require('../../config/db');
const bcrypt = require('bcrypt');

class AdminService {
  async generateAccessCode(role) {
    let prefix = 'BA';
    if (role === 'STUDENT') prefix = 'BAP-STU';
    else if (role === 'INSTRUCTOR') prefix = 'BAP-INS';
    else if (role === 'PARENT') prefix = 'BAP-PAR';

    const res = await db.query(
      `SELECT access_code FROM ba_users WHERE role = $1 AND access_code LIKE $2 ORDER BY created_at DESC LIMIT 1`,
      [role, `${prefix}-%`]
    );

    let nextNum = 1;
    if (res.rows.length > 0 && res.rows[0].access_code) {
      const parts = res.rows[0].access_code.split('-');
      const lastNum = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }

    return `${prefix}-${String(nextNum).padStart(3, '0')}`;
  }

  async logAudit(actorUserId, action, targetRecordId, details, ipAddress) {
    try {
      await db.query(
        `INSERT INTO ba_audit_logs (actor_user_id, action, target_record_id, details, ip_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [actorUserId, action, targetRecordId || null, JSON.stringify(details || {}), ipAddress || '127.0.0.1']
      );
    } catch (err) {
      console.error('Audit logging failed:', err);
    }
  }

  async getDashboardStats() {
    const [students, instructors, parents, courses, lessons, attendance, reports, grading, unassignedStudents, unlinkedParents, upcomingLessons, recentAudit] = await Promise.all([
      db.query('SELECT COUNT(*) FROM ba_students s JOIN ba_users u ON s.user_id = u.user_id WHERE u.is_active = TRUE'),
      db.query('SELECT COUNT(*) FROM ba_instructors i JOIN ba_users u ON i.user_id = u.user_id WHERE u.is_active = TRUE'),
      db.query('SELECT COUNT(*) FROM ba_parents p JOIN ba_users u ON p.user_id = u.user_id WHERE u.is_active = TRUE'),
      db.query('SELECT COUNT(*) FROM ba_courses'),
      db.query('SELECT COUNT(*) FROM ba_lessons'),
      db.query('SELECT COUNT(*) FROM ba_attendance WHERE student_present = TRUE'),
      db.query('SELECT COUNT(*) FROM ba_lesson_reports_extended'),
      db.query('SELECT COUNT(*) FROM ba_submissions WHERE grade IS NULL'),
      db.query('SELECT COUNT(*) FROM ba_students s JOIN ba_users u ON s.user_id = u.user_id WHERE u.is_active = TRUE AND s.instructor_id IS NULL'),
      db.query(`SELECT COUNT(*) FROM ba_parents p JOIN ba_users u ON p.user_id = u.user_id WHERE u.is_active = TRUE AND p.parent_id NOT IN (SELECT parent_id FROM ba_parent_students)`),
      db.query(`
        SELECT l.*, su.first_name AS student_first, su.last_name AS student_last, su.access_code AS student_code,
               iu.first_name AS instructor_first, iu.last_name AS instructor_last, iu.access_code AS instructor_code,
               c.title AS course_title
        FROM ba_lessons l
        JOIN ba_students s ON l.student_id = s.student_id
        JOIN ba_users su ON s.user_id = su.user_id
        JOIN ba_instructors i ON l.instructor_id = i.instructor_id
        JOIN ba_users iu ON i.user_id = iu.user_id
        LEFT JOIN ba_courses c ON l.course_id = c.course_id
        WHERE l.scheduled_start >= CURRENT_TIMESTAMP
        ORDER BY l.scheduled_start ASC LIMIT 5
      `),
      db.query(`
        SELECT al.*, u.email AS actor_email, u.access_code AS actor_code, u.first_name AS actor_first, u.last_name AS actor_last
        FROM ba_audit_logs al
        LEFT JOIN ba_users u ON al.actor_user_id = u.user_id
        ORDER BY al.created_at DESC LIMIT 5
      `)
    ]);

    return {
      totalStudents: parseInt(students.rows[0].count),
      totalInstructors: parseInt(instructors.rows[0].count),
      totalParents: parseInt(parents.rows[0].count),
      totalCourses: parseInt(courses.rows[0].count),
      totalLessons: parseInt(lessons.rows[0].count),
      totalAttendance: parseInt(attendance.rows[0].count),
      totalReports: parseInt(reports.rows[0].count),
      pendingGrading: parseInt(grading.rows[0].count),
      unassignedStudentsCount: parseInt(unassignedStudents.rows[0].count),
      unlinkedParentsCount: parseInt(unlinkedParents.rows[0].count),
      upcomingLessons: upcomingLessons.rows,
      recentAuditLogs: recentAudit.rows
    };
  }

  async previewNextAccessCode(role) {
    const code = await this.generateAccessCode(role);
    return { accessCode: code };
  }

  async getAllStudents() {
    const res = await db.query(
      `SELECT s.student_id, s.instructor_id, u.user_id, u.first_name, u.last_name, u.email, u.access_code, u.phone, s.grade_level, s.learning_goals, u.is_active
       FROM ba_students s JOIN ba_users u ON s.user_id = u.user_id ORDER BY u.created_at DESC`
    );
    return res.rows;
  }

  async createStudent(adminUserId, data, ipAddress) {
    const { firstName, lastName, email, password, gradeLevel, learningGoals } = data;
    const accessCode = await this.generateAccessCode('STUDENT');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRes = await db.query(
      `INSERT INTO ba_users (email, access_code, password_hash, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, 'STUDENT', TRUE) RETURNING user_id, first_name, last_name, email, access_code`,
      [email ? email.toLowerCase() : null, accessCode, passwordHash, firstName, lastName]
    );

    const userId = userRes.rows[0].user_id;

    const studentRes = await db.query(
      `INSERT INTO ba_students (user_id, grade_level, learning_goals)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, gradeLevel || null, learningGoals || null]
    );

    await this.logAudit(adminUserId, 'CREATE_STUDENT', studentRes.rows[0].student_id, { accessCode, email }, ipAddress);
    return { ...userRes.rows[0], ...studentRes.rows[0] };
  }

  async getAllInstructors() {
    const res = await db.query(
      `SELECT i.instructor_id, u.user_id, u.first_name, u.last_name, u.email, u.access_code, u.phone, u.is_active,
              COALESCE(
                json_agg(
                  json_build_object('student_id', s.student_id, 'first_name', su.first_name, 'last_name', su.last_name, 'access_code', su.access_code)
                ) FILTER (WHERE s.student_id IS NOT NULL), '[]'
              ) AS assigned_students
       FROM ba_instructors i 
       JOIN ba_users u ON i.user_id = u.user_id 
       LEFT JOIN ba_students s ON i.instructor_id = s.instructor_id
       LEFT JOIN ba_users su ON s.user_id = su.user_id
       GROUP BY i.instructor_id, u.user_id, u.first_name, u.last_name, u.email, u.access_code, u.phone, u.is_active
       ORDER BY u.created_at DESC`
    );
    return res.rows;
  }

  async createInstructor(adminUserId, data, ipAddress) {
    const { firstName, lastName, email, password } = data;
    const accessCode = await this.generateAccessCode('INSTRUCTOR');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRes = await db.query(
      `INSERT INTO ba_users (email, access_code, password_hash, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, 'INSTRUCTOR', TRUE) RETURNING user_id, first_name, last_name, email, access_code`,
      [email ? email.toLowerCase() : null, accessCode, passwordHash, firstName, lastName]
    );

    const userId = userRes.rows[0].user_id;

    const instructorRes = await db.query(
      `INSERT INTO ba_instructors (user_id)
       VALUES ($1) RETURNING *`,
      [userId]
    );

    await this.logAudit(adminUserId, 'CREATE_INSTRUCTOR', instructorRes.rows[0].instructor_id, { accessCode, email }, ipAddress);
    return { ...userRes.rows[0], ...instructorRes.rows[0] };
  }

  async getAllParents() {
    const res = await db.query(
      `SELECT p.parent_id, u.user_id, u.first_name, u.last_name, u.email, u.access_code, u.phone, u.is_active,
              ps.student_id, su.first_name AS student_first, su.last_name AS student_last, su.access_code AS student_code
       FROM ba_parents p 
       JOIN ba_users u ON p.user_id = u.user_id 
       LEFT JOIN ba_parent_students ps ON p.parent_id = ps.parent_id
       LEFT JOIN ba_students s ON ps.student_id = s.student_id
       LEFT JOIN ba_users su ON s.user_id = su.user_id
       ORDER BY u.created_at DESC`
    );
    return res.rows;
  }

  async createParent(adminUserId, data, ipAddress) {
    const { firstName, lastName, email, password, studentId } = data;
    const accessCode = await this.generateAccessCode('PARENT');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRes = await db.query(
      `INSERT INTO ba_users (email, access_code, password_hash, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, 'PARENT', TRUE) RETURNING user_id, first_name, last_name, email, access_code`,
      [email ? email.toLowerCase() : null, accessCode, passwordHash, firstName, lastName]
    );

    const userId = userRes.rows[0].user_id;

    const parentRes = await db.query(
      `INSERT INTO ba_parents (user_id)
       VALUES ($1) RETURNING *`,
      [userId]
    );

    const parentId = parentRes.rows[0].parent_id;

    if (studentId) {
      await db.query(
        `INSERT INTO ba_parent_students (parent_id, student_id, verified)
         VALUES ($1, $2, TRUE)
         ON CONFLICT (parent_id, student_id) DO NOTHING`,
        [parentId, studentId]
      );
    }

    await this.logAudit(adminUserId, 'CREATE_PARENT', parentId, { accessCode, studentId, email }, ipAddress);
    return { ...userRes.rows[0], ...parentRes.rows[0] };
  }

  async getAllCourses() {
    const res = await db.query('SELECT * FROM ba_courses ORDER BY created_at DESC');
    return res.rows;
  }

  async getAllLessons() {
    const res = await db.query(
      `SELECT l.*, su.first_name AS student_first, su.last_name AS student_last, iu.first_name AS instructor_first, iu.last_name AS instructor_last, c.title AS course_title
       FROM ba_lessons l
       JOIN ba_students s ON l.student_id = s.student_id
       JOIN ba_users su ON s.user_id = su.user_id
       JOIN ba_instructors i ON l.instructor_id = i.instructor_id
       JOIN ba_users iu ON i.user_id = iu.user_id
       LEFT JOIN ba_courses c ON l.course_id = c.course_id
       ORDER BY l.scheduled_start DESC`
    );
    return res.rows;
  }

  async getSessionDurationMonitoring() {
    const res = await db.query(
      `SELECT l.lesson_id, l.title, l.scheduled_start, l.scheduled_end,
              su.first_name AS student_first, su.last_name AS student_last,
              iu.first_name AS instructor_first, iu.last_name AS instructor_last,
              COALESCE(da.scheduled_duration_minutes, 60) AS scheduled_duration_minutes,
              COALESCE(da.provider_reported_minutes, 0) AS provider_reported_minutes,
              COALESCE(da.verified_duration_minutes, 60) AS verified_duration_minutes,
              COALESCE(da.verification_status, 'PENDING') AS verification_status
       FROM ba_lessons l
       JOIN ba_students s ON l.student_id = s.student_id
       JOIN ba_users su ON s.user_id = su.user_id
       JOIN ba_instructors i ON l.instructor_id = i.instructor_id
       JOIN ba_users iu ON i.user_id = iu.user_id
       LEFT JOIN ba_session_duration_audit da ON l.lesson_id = da.lesson_id
       ORDER BY l.scheduled_start DESC`
    );
    return res.rows;
  }

  async getAuditLogs() {
    const res = await db.query(
      `SELECT al.*, u.email AS actor_email, u.access_code AS actor_code, u.first_name AS actor_first, u.last_name AS actor_last
       FROM ba_audit_logs al
       LEFT JOIN ba_users u ON al.actor_user_id = u.user_id
       ORDER BY al.created_at DESC LIMIT 100`
    );
    return res.rows;
  }

  async issueCertificate(adminUserId, studentId, courseId, ipAddress) {
    const certCode = 'BA-CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const res = await db.query(
      `INSERT INTO ba_certificates (student_id, course_id, certificate_code, pdf_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [studentId, courseId, certCode, `https://api.brillexia.academy/certificates/${certCode}.pdf`]
    );
    await this.logAudit(adminUserId, 'ISSUE_CERTIFICATE', res.rows[0].certificate_id, { studentId, courseId, certCode }, ipAddress);
    return res.rows[0];
  }

  async updateStudent(adminUserId, studentId, data, ipAddress) {
    const { firstName, lastName, email, gradeLevel, learningGoals } = data;
    const userRes = await db.query(
      `UPDATE ba_users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), email = COALESCE($3, email)
       WHERE user_id = (SELECT user_id FROM ba_students WHERE student_id = $4) RETURNING *`,
      [firstName, lastName, email, studentId]
    );

    const studentRes = await db.query(
      `UPDATE ba_students SET grade_level = COALESCE($1, grade_level), learning_goals = COALESCE($2, learning_goals)
       WHERE student_id = $3 RETURNING *`,
      [gradeLevel, learningGoals, studentId]
    );

    await this.logAudit(adminUserId, 'UPDATE_STUDENT', studentId, { firstName, lastName }, ipAddress);
    return { ...userRes.rows[0], ...studentRes.rows[0] };
  }

  async deleteStudent(adminUserId, studentId, ipAddress) {
    // Soft delete or deactivation
    const studentRes = await db.query(`SELECT user_id FROM ba_students WHERE student_id = $1`, [studentId]);
    if (studentRes.rows.length === 0) throw new Error('Student not found.');
    const userId = studentRes.rows[0].user_id;

    await db.query(`UPDATE ba_users SET is_active = FALSE WHERE user_id = $1`, [userId]);
    await this.logAudit(adminUserId, 'DEACTIVATE_STUDENT', studentId, { userId }, ipAddress);
    return { success: true, message: 'Student deactivated successfully.' };
  }

  async updateInstructor(adminUserId, instructorId, data, ipAddress) {
    const { firstName, lastName, email } = data;
    const userRes = await db.query(
      `UPDATE ba_users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), email = COALESCE($3, email)
       WHERE user_id = (SELECT user_id FROM ba_instructors WHERE instructor_id = $4) RETURNING *`,
      [firstName, lastName, email, instructorId]
    );

    await this.logAudit(adminUserId, 'UPDATE_INSTRUCTOR', instructorId, { firstName, lastName }, ipAddress);
    return userRes.rows[0];
  }

  async deleteInstructor(adminUserId, instructorId, ipAddress) {
    const instRes = await db.query(`SELECT user_id FROM ba_instructors WHERE instructor_id = $1`, [instructorId]);
    if (instRes.rows.length === 0) throw new Error('Instructor not found.');
    const userId = instRes.rows[0].user_id;

    await db.query(`UPDATE ba_users SET is_active = FALSE WHERE user_id = $1`, [userId]);
    await this.logAudit(adminUserId, 'DEACTIVATE_INSTRUCTOR', instructorId, { userId }, ipAddress);
    return { success: true, message: 'Instructor deactivated successfully.' };
  }

  async updateParent(adminUserId, parentId, data, ipAddress) {
    const { firstName, lastName, email, studentId } = data;
    
    // 1. Update user info
    const userRes = await db.query(
      `UPDATE ba_users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), email = COALESCE($3, email)
       WHERE user_id = (SELECT user_id FROM ba_parents WHERE parent_id = $4) RETURNING *`,
      [firstName, lastName, email, parentId]
    );

    // 2. If studentId is provided, upsert/replace parent-student mapping
    if (studentId !== undefined) {
      if (studentId) {
        await db.query(
          `INSERT INTO ba_parent_students (parent_id, student_id, verified)
           VALUES ($1, $2, TRUE)
           ON CONFLICT (parent_id, student_id) DO UPDATE SET verified = TRUE`,
          [parentId, studentId]
        );
      } else {
        // If empty studentId passed, remove links if desired, or keep existing. 
        // To allow clearing or reassigning:
        await db.query(`DELETE FROM ba_parent_students WHERE parent_id = $1`, [parentId]);
      }
    }

    await this.logAudit(adminUserId, 'UPDATE_PARENT', parentId, { firstName, lastName, studentId }, ipAddress);
    return userRes.rows[0];
  }

  async deleteParent(adminUserId, parentId, ipAddress) {
    const parentRes = await db.query(`SELECT user_id FROM ba_parents WHERE parent_id = $1`, [parentId]);
    if (parentRes.rows.length === 0) throw new Error('Parent not found.');
    const userId = parentRes.rows[0].user_id;

    await db.query(`UPDATE ba_users SET is_active = FALSE WHERE user_id = $1`, [userId]);
    await this.logAudit(adminUserId, 'DEACTIVATE_PARENT', parentId, { userId }, ipAddress);
    return { success: true, message: 'Parent deactivated successfully.' };
  }

  async createCourse(adminUserId, data, ipAddress) {
    const { title, code, subject, description } = data;
    const res = await db.query(
      `INSERT INTO ba_courses (title, code, subject, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, code, subject, description]
    );
    await this.logAudit(adminUserId, 'CREATE_COURSE', res.rows[0].course_id, { title, code }, ipAddress);
    return res.rows[0];
  }

  async createLesson(adminUserId, data, ipAddress) {
    const { title, studentId, instructorId, courseId, scheduledStart, scheduledEnd, meetingUrl } = data;
    const res = await db.query(
      `INSERT INTO ba_lessons (title, student_id, instructor_id, course_id, scheduled_start, scheduled_end, meeting_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'SCHEDULED') RETURNING *`,
      [title, studentId, instructorId, courseId || null, scheduledStart, scheduledEnd, meetingUrl]
    );
    await this.logAudit(adminUserId, 'CREATE_LESSON', res.rows[0].lesson_id, { title }, ipAddress);
    return res.rows[0];
  }

  async assignStudentToInstructor(adminUserId, studentId, instructorId, ipAddress) {
    const res = await db.query(
      `UPDATE ba_students SET instructor_id = $1, updated_at = CURRENT_TIMESTAMP WHERE student_id = $2 RETURNING *`,
      [instructorId || null, studentId]
    );
    await this.logAudit(adminUserId, 'ASSIGN_STUDENT_INSTRUCTOR', studentId, { instructorId }, ipAddress);
    return res.rows[0];
  }
}

module.exports = new AdminService();