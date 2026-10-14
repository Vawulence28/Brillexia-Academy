const db = require('../../config/db');

class MaterialService {
  async getMaterials(userId) {
    const instRes = await db.query('SELECT instructor_id FROM ba_instructors WHERE user_id = $1', [userId]);
    if (instRes.rows.length === 0) throw { statusCode: 404, message: 'Instructor not found' };
    const instructorId = instRes.rows[0].instructor_id;

    const res = await db.query(
      `SELECT m.*, c.title AS course_title FROM ba_materials m
       LEFT JOIN ba_courses c ON m.course_id = c.course_id
       WHERE m.uploaded_by = $1 ORDER BY m.created_at DESC`,
      [userId]
    );
    return res.rows;
  }

  async uploadMaterial(userId, data) {
    const { courseId, lessonId, title, fileUrl, fileType } = data;
    const res = await db.query(
      `INSERT INTO ba_materials (course_id, lesson_id, title, file_url, file_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [courseId || null, lessonId || null, title, fileUrl, fileType || 'DOCUMENT', userId]
    );
    return res.rows[0];
  }
}

module.exports = new MaterialService();