const express = require('express');
const router = express.Router();
const { createTrip, getTripById, acceptTrip, arriveAtPickup, startTrip, completeTrip } = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createTrip);
router.get('/:id', protect, getTripById);
router.put('/:id/accept', protect, authorize('driver'), acceptTrip);
router.put('/:id/arrive', protect, authorize('driver'), arriveAtPickup);
router.put('/:id/start', protect, authorize('driver'), startTrip);
router.put('/:id/complete', protect, authorize('driver'), completeTrip);

module.exports = router;
