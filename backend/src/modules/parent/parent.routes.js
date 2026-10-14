const express = require('express');
const router = express.Router();
const parentController = require('./parent.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

router.use(authenticateToken, authorizeRoles('PARENT'));

router.get('/children', parentController.getLinkedChildren);
router.get('/children/:studentId/dashboard', parentController.getChildDashboard);
router.get('/children/:studentId/schedule', parentController.getChildSchedule);
router.get('/children/:studentId/attendance', parentController.getChildAttendance);
router.get('/children/:studentId/results', parentController.getChildResults);
router.get('/children/:studentId/certificates', parentController.getChildCertificates);

module.exports = router;
