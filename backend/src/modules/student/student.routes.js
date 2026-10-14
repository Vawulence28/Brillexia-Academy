const express = require('express');
const router = express.Router();
const studentController = require('./student.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

router.use(authenticateToken, authorizeRoles('STUDENT'));

router.get('/dashboard', studentController.getDashboard);
router.get('/lessons', studentController.getLessons);
router.get('/attendance', studentController.getAttendance);
router.get('/courses', studentController.getCourses);
router.get('/certificates', studentController.getCertificates);
router.put('/profile', studentController.updateProfile);

module.exports = router;