const express = require('express');
const router = express.Router();
const { arriveAtPickup, startTrip, completeTrip, getTrip, getUserTrips, cancelTrip } = require('../controllers/trip.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.get('/', protect, getUserTrips);
router.get('/:id', protect, getTrip);

router.put('/:id/arrive', protect, arriveAtPickup);
router.put('/:id/start', protect, upload.single('startMeterImage'), startTrip);
router.put('/:id/complete', protect, upload.single('endMeterImage'), completeTrip);
router.put('/:id/cancel', protect, cancelTrip);

module.exports = router;

