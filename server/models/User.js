const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'driver', 'admin'],
        default: 'customer'
    },
    profileImage: {
        type: String,
        default: ''
    },
    // Driver specific fields
    isOnline: {
        type: Boolean,
        default: false
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    vehicleType: {
        type: String,
        enum: ['auto', 'manual', 'both', 'none'],
        default: 'none'
    },
    points: {
        type: Number,
        default: 0
    },
    badge: {
        type: String,
        default: 'Rookie Pilot'
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    savedLocations: [{
        label: String, // e.g., 'Home', 'Work'
        address: String,
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    }]
}, { timestamps: true });

// Index for geospatial queries
userSchema.index({ currentLocation: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
