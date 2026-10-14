const assignmentService = require('./assignment.service');

class AssignmentController {
  async getAssignments(req, res, next) {
    try {
      const assignments = await assignmentService.getAssignments(req.user.userId);
      res.status(200).json({ success: true, data: assignments });
    } catch (err) {
      next(err);
    }
  }

  async submitAssignment(req, res, next) {
    try {
      const { assignmentId } = req.params;
      const { fileUrl, studentComment } = req.body;
      const submission = await assignmentService.submitAssignment(req.user.userId, assignmentId, fileUrl, studentComment);
      res.status(200).json({ success: true, message: 'Assignment submitted successfully.', data: submission });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AssignmentController();