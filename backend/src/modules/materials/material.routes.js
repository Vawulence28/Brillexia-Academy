const express = require('express');
const router = express.Router();
const materialController = require('./material.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

router.use(authenticateToken, authorizeRoles('INSTRUCTOR'));

router.get('/', materialController.getMaterials);
router.post('/', materialController.uploadMaterial);

module.exports = router;