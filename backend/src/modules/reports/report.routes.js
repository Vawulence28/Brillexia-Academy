const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

router.use(authenticateToken, authorizeRoles('INSTRUCTOR'));

router.get('/', reportController.getReports);
router.post('/', reportController.createReport);

module.exports = router;