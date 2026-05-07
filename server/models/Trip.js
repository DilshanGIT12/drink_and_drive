const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    tripType: {
        type: String,
        enum: ['standard', 'hourly', 'long_tour'],
        default: 'standard'
    },
    status: {
        type: String,
        enum: ['searching', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'],
        default: 'searching'
    },
    pickupLocation: {
        address: String,
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },
    dropoffLocation: {
        address: String,
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },
    otp: {
        type: String,
        required: true
    },
    // Timestamps
    requestedAt: { type: Date, default: Date.now },
    driverArrivedAt: Date,
    startedAt: Date,
    completedAt: Date,
    // Meter Proof
    startMeterImage: String, // Cloudinary URL
    endMeterImage: String,   // Cloudinary URL
    // Metrics
    totalDistance: { type: Number, default: 0 }, // in km
    waitDuration: { type: Number, default: 0 }, // in minutes
    // Billing
    calculatedFare: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    messages: [{
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        senderName: String,
        text: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
