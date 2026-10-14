const attendanceService = require('./attendance.service');

class AttendanceController {
  async getAttendance(req, res, next) {
    try {
      const records = await attendanceService.getAttendanceRecords(req.user.userId);
      res.status(200).json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  }

  async markAttendance(req, res, next) {
    try {
      const record = await attendanceService.markAttendance(req.user.userId, req.body);
      res.status(200).json({ success: true, message: 'Attendance recorded successfully.', data: record });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AttendanceController();