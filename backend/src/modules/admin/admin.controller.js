const adminService = require('./admin.service');

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  async getStudents(req, res, next) {
    try {
      const students = await adminService.getAllStudents();
      res.status(200).json({ success: true, data: students });
    } catch (err) {
      next(err);
    }
  }

  async createStudent(req, res, next) {
    try {
      const student = await adminService.createStudent(req.user.userId, req.body);
      res.status(201).json({ success: true, message: 'Student registered successfully.', data: student });
    } catch (err) {
      next(err);
    }
  }

  async getInstructors(req, res, next) {
    try {
      const instructors = await adminService.getAllInstructors();
      res.status(200).json({ success: true, data: instructors });
    } catch (err) {
      next(err);
    }
  }

  async createInstructor(req, res, next) {
    try {
      const instructor = await adminService.createInstructor(req.user.userId, req.body);
      res.status(201).json({ success: true, message: 'Instructor provisioned successfully.', data: instructor });
    } catch (err) {
      next(err);
    }
  }

  async getParents(req, res, next) {
    try {
      const parents = await adminService.getAllParents();
      res.status(200).json({ success: true, data: parents });
    } catch (err) {
      next(err);
    }
  }

  async createParent(req, res, next) {
    try {
      const parent = await adminService.createParent(req.user.userId, req.body);
      res.status(201).json({ success: true, message: 'Parent account created successfully.', data: parent });
    } catch (err) {
      next(err);
    }
  }

  async getCourses(req, res, next) {
    try {
      const courses = await adminService.getAllCourses();
      res.status(200).json({ success: true, data: courses });
    } catch (err) {
      next(err);
    }
  }

  async getLessons(req, res, next) {
    try {
      const lessons = await adminService.getAllLessons();
      res.status(200).json({ success: true, data: lessons });
    } catch (err) {
      next(err);
    }
  }

  async getDurationMonitoring(req, res, next) {
    try {
      const monitoring = await adminService.getSessionDurationMonitoring();
      res.status(200).json({ success: true, data: monitoring });
    } catch (err) {
      next(err);
    }
  }

  async getAuditLogs(req, res, next) {
    try {
      const logs = await adminService.getAuditLogs();
      res.status(200).json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }

  async issueCertificate(req, res, next) {
    try {
      const { studentId, courseId } = req.body;
      const cert = await adminService.issueCertificate(req.user.userId, studentId, courseId);
      res.status(201).json({ success: true, message: 'Certificate issued successfully.', data: cert });
    } catch (err) {
      next(err);
    }
  }

  async updateStudent(req, res, next) {
    try {
      const student = await adminService.updateStudent(req.user.userId, req.params.id, req.body, req.ip);
      res.status(200).json({ success: true, message: 'Student updated.', data: student });
    } catch (err) { next(err); }
  }

  async deleteStudent(req, res, next) {
    try {
      const result = await adminService.deleteStudent(req.user.userId, req.params.id, req.ip);
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  async updateInstructor(req, res, next) {
    try {
      const instructor = await adminService.updateInstructor(req.user.userId, req.params.id, req.body, req.ip);
      res.status(200).json({ success: true, message: 'Instructor updated.', data: instructor });
    } catch (err) { next(err); }
  }

  async deleteInstructor(req, res, next) {
    try {
      const result = await adminService.deleteInstructor(req.user.userId, req.params.id, req.ip);
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  async updateParent(req, res, next) {
    try {
      const parent = await adminService.updateParent(req.user.userId, req.params.id, req.body, req.ip);
      res.status(200).json({ success: true, message: 'Parent updated.', data: parent });
    } catch (err) { next(err); }
  }

  async deleteParent(req, res, next) {
    try {
      const result = await adminService.deleteParent(req.user.userId, req.params.id, req.ip);
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  async previewStudentCode(req, res, next) {
    try {
      const data = await adminService.previewNextAccessCode('STUDENT');
      res.status(200).json({ success: true, ...data });
    } catch (err) { next(err); }
  }

  async previewInstructorCode(req, res, next) {
    try {
      const data = await adminService.previewNextAccessCode('INSTRUCTOR');
      res.status(200).json({ success: true, ...data });
    } catch (err) { next(err); }
  }

  async previewParentCode(req, res, next) {
    try {
      const data = await adminService.previewNextAccessCode('PARENT');
      res.status(200).json({ success: true, ...data });
    } catch (err) { next(err); }
  }

  async createCourse(req, res, next) {
    try {
      const course = await adminService.createCourse(req.user.userId, req.body, req.ip);
      res.status(201).json({ success: true, message: 'Course created successfully.', data: course });
    } catch (err) { next(err); }
  }

  async createLesson(req, res, next) {
    try {
      const lesson = await adminService.createLesson(req.user.userId, req.body, req.ip);
      res.status(201).json({ success: true, message: 'Lesson scheduled successfully.', data: lesson });
    } catch (err) { next(err); }
  }

  async assignInstructor(req, res, next) {
    try {
      const { studentId, instructorId } = req.body;
      const data = await adminService.assignStudentToInstructor(req.user.userId, studentId, instructorId, req.ip);
      res.status(200).json({ success: true, message: 'Student instructor assignment updated successfully.', data });
    } catch (err) { next(err); }
  }
}

module.exports = new AdminController();