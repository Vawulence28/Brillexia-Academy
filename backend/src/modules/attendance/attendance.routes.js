const express = require('express');
const router = express.Router();
const attendanceController = require('./attendance.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

router.use(authenticateToken, authorizeRoles('INSTRUCTOR'));

router.get('/', attendanceController.getAttendance);
router.post('/', attendanceController.markAttendance);

module.exports = router;