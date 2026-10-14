const studentService = require('./student.service');

class StudentController {
  async getDashboard(req, res, next) {
    try {
      const data = await studentService.getDashboardData(req.user.userId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getLessons(req, res, next) {
    try {
      const lessons = await studentService.getLessons(req.user.userId);
      res.status(200).json({ success: true, data: lessons });
    } catch (err) {
      next(err);
    }
  }

  async getAttendance(req, res, next) {
    try {
      const attendance = await studentService.getAttendance(req.user.userId);
      res.status(200).json({ success: true, data: attendance });
    } catch (err) {
      next(err);
    }
  }

  async getCourses(req, res, next) {
    try {
      const courses = await studentService.getCourses(req.user.userId);
      res.status(200).json({ success: true, data: courses });
    } catch (err) {
      next(err);
    }
  }

  async getCertificates(req, res, next) {
    try {
      const certificates = await studentService.getCertificates(req.user.userId);
      res.status(200).json({ success: true, data: certificates });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { phone, learningGoals } = req.body;
      const result = await studentService.updateProfile(req.user.userId, phone, learningGoals);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StudentController();