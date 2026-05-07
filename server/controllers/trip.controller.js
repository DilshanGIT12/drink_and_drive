const Trip = require('../models/Trip');
const User = require('../models/User');

// Utility: Calculate Wait Time Penalty
const calculateWaitPenalty = (arrivalTime, startTime) => {
    const diffMs = startTime - arrivalTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins <= 15) return 0; // First 15 mins free
    
    const excessMins = diffMins - 15;
    const blocks = Math.ceil(excessMins / 30); // 400 LKR for every 30-min block
    return blocks * 400;
};

// @desc    Driver arrived at pickup
// @route   PUT /api/trips/:id/arrive
exports.arriveAtPickup = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        trip.status = 'arrived';
        trip.driverArrivedAt = new Date();
        await trip.save();

        const updatedTrip = await Trip.findById(trip._id).populate('customerId', 'fullName phoneNumber').populate('driverId', 'fullName phoneNumber');
        res.json(updatedTrip);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Start trip with OTP and Start Meter Image
// @route   PUT /api/trips/:id/start
exports.startTrip = async (req, res) => {
    try {
        const { otp } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        trip.status = 'in_progress';
        trip.startedAt = new Date();
        if (req.file) {
            // Normalize path for local storage (replace backslashes) or use Cloudinary URL
            trip.startMeterImage = req.file.path.replace(/\\/g, '/');
        }
        await trip.save();

        console.log(`[TRIP START] ID: ${trip._id}, Image: ${trip.startMeterImage}`);


        const updatedTrip = await Trip.findById(trip._id).populate('customerId', 'fullName phoneNumber').populate('driverId', 'fullName phoneNumber');
        res.json(updatedTrip);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete trip and calculate final fare
exports.completeTrip = async (req, res) => {
    try {
        const { totalDistance } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        const completedAt = new Date();
        const durationMs = completedAt - trip.startedAt;
        const totalHours = Math.ceil(durationMs / 3600000); // Round up to nearest started hour
        
        let finalFare = 0;
        let breakdown = {};

        if (trip.tripType === 'standard') {
            // Standard Distance Logic
            finalFare = 2500;
            if (totalDistance > 10) {
                finalFare += Math.ceil(totalDistance - 10) * 100;
            }
            const waitPenalty = calculateWaitPenalty(trip.driverArrivedAt, trip.startedAt);
            finalFare += waitPenalty;
            
            breakdown = { base: 2500, extraDistance: finalFare - 2500 - waitPenalty, waitPenalty };
        } 
        else if (trip.tripType === 'hourly') {
            // Hourly: 4000 (1st hr) + 1200 per add. started hr
            finalFare = 4000;
            if (totalHours > 1) {
                finalFare += (totalHours - 1) * 1200;
            }
            breakdown = { base: 4000, extraHours: totalHours > 1 ? (totalHours - 1) * 1200 : 0 };
        } 
        else if (trip.tripType === 'long_tour') {
            // Long Tour: 8000 (10 hrs) + 700 per add. started hr
            finalFare = 8000;
            if (totalHours > 10) {
                finalFare += (totalHours - 10) * 700;
            }
            breakdown = { base: 8000, extraHours: totalHours > 10 ? (totalHours - 10) * 700 : 0 };
        }

        trip.status = 'completed';
        trip.completedAt = completedAt;
        trip.totalDistance = totalDistance;
        if (req.file) {
            trip.endMeterImage = req.file.path.replace(/\\/g, '/');
        }
        trip.calculatedFare = finalFare;
        await trip.save();

        console.log(`[TRIP COMPLETE] ID: ${trip._id}, Distance: ${totalDistance}, Image: ${trip.endMeterImage}`);


        // Update Driver Points and Badge
        const driver = await User.findById(trip.driverId);
        if (driver) {
            // Logic: 10 base points + 1 point for every 500 LKR earned
            const earnedPoints = 10 + Math.floor(finalFare / 500);
            driver.points = (driver.points || 0) + earnedPoints;

            // Badge Promotion Logic
            if (driver.points > 2000) driver.badge = 'Legendary Ace';
            else if (driver.points > 750) driver.badge = 'Elite Captain';
            else if (driver.points > 250) driver.badge = 'Pro Navigator';
            
            await driver.save();
        }

        const updatedTrip = await Trip.findById(trip._id).populate('customerId', 'fullName phoneNumber').populate('driverId', 'fullName phoneNumber');
        res.json({ trip: updatedTrip, breakdown });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ 
            $or: [{ customerId: req.user._id }, { driverId: req.user._id }] 
        }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTrip = async (req, res) => {

    try {
        const trip = await Trip.findById(req.params.id)
            .populate('customerId', 'fullName phoneNumber')
            .populate('driverId', 'fullName phoneNumber');
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.cancelTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        if (trip.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed trip' });
        }

        trip.status = 'cancelled';
        await trip.save();

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
