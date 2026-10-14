const express = require('express');
const router = express.Router();
const instructorController = require('./instructor.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

router.use(authenticateToken, authorizeRoles('INSTRUCTOR'));

router.get('/dashboard', instructorController.getDashboard);
router.get('/students', instructorController.getAssignedStudents);
router.get('/schedule', instructorController.getSchedule);
router.post('/lessons', instructorController.scheduleLesson);

module.exports = router;