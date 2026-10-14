const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/dashboard', adminController.getDashboard);

router.get('/students', adminController.getStudents);
router.post('/students', adminController.createStudent);

router.get('/instructors', adminController.getInstructors);
router.post('/instructors', adminController.createInstructor);

router.get('/parents', adminController.getParents);
router.post('/parents', adminController.createParent);

router.get('/courses', adminController.getCourses);
router.get('/lessons', adminController.getLessons);
router.get('/duration-monitoring', adminController.getDurationMonitoring);
router.get('/audit-logs', adminController.getAuditLogs);
router.post('/certificates', adminController.issueCertificate);

router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

router.put('/instructors/:id', adminController.updateInstructor);
router.delete('/instructors/:id', adminController.deleteInstructor);

router.put('/parents/:id', adminController.updateParent);
router.delete('/parents/:id', adminController.deleteParent);

router.get('/students/preview-code', adminController.previewStudentCode);
router.get('/instructors/preview-code', adminController.previewInstructorCode);
router.get('/parents/preview-code', adminController.previewParentCode);

router.post('/courses', adminController.createCourse);
router.post('/lessons', adminController.createLesson);

router.post('/students/assign-instructor', adminController.assignInstructor);

module.exports = router;