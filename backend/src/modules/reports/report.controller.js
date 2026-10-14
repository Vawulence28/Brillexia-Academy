const reportService = require('./report.service');

class ReportController {
  async createReport(req, res, next) {
    try {
      const report = await reportService.createReport(req.user.userId, req.body);
      res.status(201).json({ success: true, message: 'Lesson report submitted successfully.', data: report });
    } catch (err) {
      next(err);
    }
  }

  async getReports(req, res, next) {
    try {
      const reports = await reportService.getInstructorReports(req.user.userId);
      res.status(200).json({ success: true, data: reports });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReportController();