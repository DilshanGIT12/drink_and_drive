const User = require('../models/User');
const Trip = require('../models/Trip');

// @desc    Get Global Statistics
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalDrivers = await User.countDocuments({ role: 'driver' });
        const onlineDrivers = await User.countDocuments({ role: 'driver', isOnline: true });
        const onlineCustomers = await User.countDocuments({ role: 'customer', isOnline: true });
        const activeTrips = await Trip.countDocuments({ status: { $in: ['accepted', 'arrived', 'in_progress'] } });
        
        const trips = await Trip.find({ status: 'completed' });
        const totalRevenue = trips.reduce((sum, trip) => sum + (trip.calculatedFare || 0), 0);

        res.json({
            totalUsers,
            totalDrivers,
            onlineDrivers,
            onlineCustomers,
            activeTrips,
            totalRevenue
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Drivers for Management
exports.getDrivers = async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver' }).select('-password');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve/Reject Driver
exports.updateDriverStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const driver = await User.findByIdAndUpdate(req.params.id, { approvalStatus: status }, { new: true });
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Trips
exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('customerId', 'fullName phoneNumber')
            .populate('driverId', 'fullName phoneNumber')
            .sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
