const parentService = require('./parent.service');

class ParentController {
  async getLinkedChildren(req, res, next) {
    try {
      const children = await parentService.getLinkedChildren(req.user.userId);
      res.status(200).json({ success: true, data: children });
    } catch (err) {
      next(err);
    }
  }

  async getChildDashboard(req, res, next) {
    try {
      const { studentId } = req.params;
      const data = await parentService.getChildDashboard(req.user.userId, studentId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getChildSchedule(req, res, next) {
    try {
      const { studentId } = req.params;
      const schedule = await parentService.getChildSchedule(req.user.userId, studentId);
      res.status(200).json({ success: true, data: schedule });
    } catch (err) {
      next(err);
    }
  }

  async getChildAttendance(req, res, next) {
    try {
      const { studentId } = req.params;
      const attendance = await parentService.getChildAttendance(req.user.userId, studentId);
      res.status(200).json({ success: true, data: attendance });
    } catch (err) {
      next(err);
    }
  }

  async getChildResults(req, res, next) {
    try {
      const { studentId } = req.params;
      const results = await parentService.getChildResults(req.user.userId, studentId);
      res.status(200).json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }

  async getChildCertificates(req, res, next) {
    try {
      const { studentId } = req.params;
      const certificates = await parentService.getChildCertificates(req.user.userId, studentId);
      res.status(200).json({ success: true, data: certificates });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ParentController();