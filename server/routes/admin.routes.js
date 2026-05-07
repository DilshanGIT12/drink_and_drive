const express = require('express');
const router = express.Router();
const { getStats, getDrivers, updateDriverStatus, getAllTrips } = require('../controllers/admin.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

// Protect all admin routes
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/stats', getStats);
router.get('/drivers', getDrivers);
router.put('/drivers/:id/status', updateDriverStatus);
router.get('/trips', getAllTrips);

module.exports = router;
