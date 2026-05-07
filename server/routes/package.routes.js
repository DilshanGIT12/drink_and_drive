const express = require('express');
const router = express.Router();
const { getPackages, createPackage } = require('../controllers/package.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/', protect, getPackages);
router.post('/', protect, authorizeRoles('admin'), createPackage);

module.exports = router;
