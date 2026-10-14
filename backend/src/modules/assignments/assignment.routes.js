const express = require('express');
const router = express.Router();
const assignmentController = require('./assignment.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

router.use(authenticateToken, authorizeRoles('STUDENT'));

router.get('/', assignmentController.getAssignments);
router.post('/:assignmentId/submit', assignmentController.submitAssignment);

module.exports = router;