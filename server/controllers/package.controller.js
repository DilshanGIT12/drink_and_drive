const Package = require('../models/Package');

// @desc    Get all active packages
// @route   GET /api/packages
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find({ isActive: true });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new package (Admin)
// @route   POST /api/packages
exports.createPackage = async (req, res) => {
    try {
        const newPackage = await Package.create(req.body);
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
