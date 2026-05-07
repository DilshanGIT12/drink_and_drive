/**
 * Pricing Calculator for Designated Driver Platform
 * 
 * Rules:
 * 1. Standard:
 *    - Base fare: 2500 LKR for the first 10km.
 *    - Distance penalty: 100 LKR for every additional 1km.
 *    - Wait-time penalty: First 15 minutes free. After that, 400 LKR per 15 minutes.
 *      (Matches example: 1 hour late = (60-15)/15 * 400 = 1200 LKR)
 * 
 * 2. Hourly:
 *    - 4000 LKR for the 1st hour.
 *    - 1200 LKR for every additional hour.
 * 
 * 3. Long Tour (24hr):
 *    - 8000 LKR base (covers first 10 hours).
 *    - 700 LKR for every additional hour.
 */

const calculateStandardFare = (distance, waitTimeMinutes) => {
    let fare = 2500; // Base fare

    // Distance penalty
    if (distance > 10) {
        const extraDistance = Math.ceil(distance - 10);
        fare += extraDistance * 100;
    }

    // Wait-time penalty
    if (waitTimeMinutes > 15) {
        const excessWait = waitTimeMinutes - 15;
        const waitBlocks = Math.ceil(excessWait / 15);
        fare += waitBlocks * 400;
    }

    return fare;
};

const calculateHourlyFare = (totalMinutes) => {
    const totalHours = Math.ceil(totalMinutes / 60);
    let fare = 4000; // 1st hour

    if (totalHours > 1) {
        fare += (totalHours - 1) * 1200;
    }

    return fare;
};

const calculateLongTourFare = (totalMinutes) => {
    const totalHours = Math.ceil(totalMinutes / 60);
    let fare = 8000; // Covers 10 hours

    if (totalHours > 10) {
        fare += (totalHours - 10) * 700;
    }

    return fare;
};

const calculateFinalFare = (tripType, distance, totalMinutes, waitTimeMinutes = 0) => {
    switch (tripType) {
        case 'standard':
            return calculateStandardFare(distance, waitTimeMinutes);
        case 'hourly':
            return calculateHourlyFare(totalMinutes);
        case 'long_tour':
            return calculateLongTourFare(totalMinutes);
        default:
            return 0;
    }
};

module.exports = {
    calculateStandardFare,
    calculateHourlyFare,
    calculateLongTourFare,
    calculateFinalFare
};
