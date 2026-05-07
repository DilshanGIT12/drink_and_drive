const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

exports.register = async (req, res) => {
    try {
        const { fullName, phoneNumber, password, role } = req.body;
        console.log(`[AUTH] Register Attempt: ${phoneNumber} (${role})`);

        const userExists = await User.findOne({ phoneNumber });
        if (userExists) {
            console.log(`[AUTH ERROR] User already exists: ${phoneNumber}`);
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            fullName,
            phoneNumber,
            password,
            role: role || 'customer'
        });

        console.log(`[AUTH SUCCESS] Created User: ${user._id}`);
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.error(`[AUTH REG CRASH] ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        console.log(`[AUTH] Login Attempt: ${phoneNumber}`);

        const user = await User.findOne({ phoneNumber });
        if (!user) {
            console.log(`[AUTH ERROR] User not found: ${phoneNumber}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`[AUTH ERROR] Password mismatch: ${phoneNumber}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log(`[AUTH SUCCESS] Login: ${user._id}`);
        const token = generateToken(user);

        res.json({
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.error(`[AUTH LOGIN CRASH] ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};
