const Trip = require('../models/Trip');
const User = require('../models/User');
const { calculateFinalFare } = require('../utils/pricingCalculator');

// @desc    Create a new trip request
// @route   POST /api/trips
// @access  Private (Customer)
exports.createTrip = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, tripType, vehicleType } = req.body;

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const trip = await Trip.create({
            customerId: req.user._id,
            pickupLocation,
            dropoffLocation,
            tripType,
            otp
        });

        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Private
exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate('customerId', 'fullName phoneNumber')
            .populate('driverId', 'fullName phoneNumber');
            
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept a trip
// @route   PUT /api/trips/:id/accept
// @access  Private (Driver)
exports.acceptTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.status !== 'searching') {
            return res.status(400).json({ message: 'Trip already taken' });
        }

        trip.driverId = req.user._id;
        trip.status = 'accepted';
        await trip.save();

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Start the trip (OTP required)
// @route   PUT /api/trips/:id/start
exports.startTrip = async (req, res) => {
    try {
        const { otp, startMeterImage } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        // Calculate wait time since driver arrived
        const waitDuration = trip.driverArrivedAt 
            ? Math.round((new Date() - trip.driverArrivedAt) / 60000)
            : 0;

        trip.status = 'in_progress';
        trip.startedAt = new Date();
        trip.startMeterImage = startMeterImage;
        trip.waitDuration = waitDuration;
        await trip.save();

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete the trip
// @route   PUT /api/trips/:id/complete
exports.completeTrip = async (req, res) => {
    try {
        const { totalDistance, endMeterImage } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        const completedAt = new Date();
        const totalMinutes = trip.startedAt
            ? Math.round((completedAt - trip.startedAt) / 60000)
            : 0;

        // Calculate Final Fare
        const calculatedFare = calculateFinalFare(
            trip.tripType,
            totalDistance,
            totalMinutes,
            trip.waitDuration
        );

        trip.status = 'completed';
        trip.completedAt = completedAt;
        trip.totalDistance = totalDistance;
        trip.endMeterImage = endMeterImage;
        trip.calculatedFare = calculatedFare;
        await trip.save();

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
