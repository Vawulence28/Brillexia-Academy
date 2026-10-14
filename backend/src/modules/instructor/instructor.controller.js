const instructorService = require('./instructor.service');

class InstructorController {
  async getDashboard(req, res, next) {
    try {
      const data = await instructorService.getDashboardData(req.user.userId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getAssignedStudents(req, res, next) {
    try {
      const students = await instructorService.getAssignedStudents(req.user.userId);
      res.status(200).json({ success: true, data: students });
    } catch (err) {
      next(err);
    }
  }

  async getSchedule(req, res, next) {
    try {
      const schedule = await instructorService.getSchedule(req.user.userId);
      res.status(200).json({ success: true, data: schedule });
    } catch (err) {
      next(err);
    }
  }

  async scheduleLesson(req, res, next) {
    try {
      const lesson = await instructorService.scheduleLesson(req.user.userId, req.body);
      res.status(201).json({ success: true, message: '1-on-1 lesson scheduled successfully.', data: lesson });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InstructorController();