const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    baseIncludedHours: {
        type: Number,
        required: true
    },
    extraHourRate: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
