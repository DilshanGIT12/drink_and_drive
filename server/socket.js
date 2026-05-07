const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Trip = require('./models/Trip');

// In-memory pool for online drivers
const onlineDrivers = new Map(); // driverId -> { socketId, vehicleType }
const activeRequests = new Map(); // customerId -> tripData

const socketHandler = (io) => {
    // Middleware for Socket Authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log(`[SOCKET AUTH ERROR] No token provided from socket: ${socket.id}`);
            return next(new Error('Authentication error'));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(`[SOCKET AUTH ERROR] Token verification failed for token snippet: ${token.substring(0, 10)}... Error: ${err.message}`);
                return next(new Error('Authentication error'));
            }
            socket.userId = decoded.id;
            socket.role = decoded.role;
            console.log(`[SOCKET AUTH SUCCESS] User: ${socket.userId}, Role: ${socket.role}, Socket: ${socket.id}`);
            next();
        });
    });

    io.on('connect_error', (err) => {
        console.log(`[SOCKET SERVER ERROR] Connection error: ${err.message}`);
    });

    io.on('connection', async (socket) => {
        console.log(`Connected: ${socket.userId} (${socket.role})`);
        
        // Update DB: Set Online
        await User.findByIdAndUpdate(socket.userId, { isOnline: true });


        // Handle Driver Online
        socket.on('driver-online', (data) => {
            if (socket.role === 'driver') {
                onlineDrivers.set(socket.userId, {
                    socketId: socket.id,
                    vehicleType: data.vehicleType // auto, manual, or both
                });
                console.log(`Driver ${socket.userId} is ONLINE`);

                // SEND ACTIVE REQUESTS TO THIS DRIVER IMMEDIATELY
                activeRequests.forEach((request, customerId) => {
                    const isCompatible = data.vehicleType === 'both' || 
                                       data.vehicleType === request.vehicleType || 
                                       request.vehicleType === 'both';
                    if (isCompatible) {
                        socket.emit('new-ride-request', request);
                    }
                });
            }
        });

        // Handle Customer Ride Request
        socket.on('request-ride', (tripData) => {
            console.log(`[SOCKET] Mission Request from Customer: ${socket.userId}`);
            console.log(`[SOCKET] Current Online Drivers Count: ${onlineDrivers.size}`);
            
            const fullRequest = {
                ...tripData,
                customerId: socket.userId,
                customerSocketId: socket.id
            };

            // Store in active requests
            activeRequests.set(socket.userId, fullRequest);

            // Broadcast only to matching drivers
            onlineDrivers.forEach((driver, driverId) => {
                const isCompatible = driver.vehicleType === 'both' || 
                                   driver.vehicleType === tripData.vehicleType || 
                                   tripData.vehicleType === 'both';

                console.log(`[SOCKET] Checking Driver ${driverId}: isCompatible=${isCompatible}, socketId=${driver.socketId}`);

                if (isCompatible) {
                    console.log(`[SOCKET] Emitting new-ride-request to Driver ${driverId}`);
                    io.to(driver.socketId).emit('new-ride-request', fullRequest);
                }
            });
        });

        // Handle Driver Accept Ride
        socket.on('accept-ride', async (data) => {
            try {
                // Remove from active requests
                activeRequests.delete(data.customerId);

                // Generate 4-digit OTP
                const otp = Math.floor(1000 + Math.random() * 9000).toString();

                // Create Trip in Database
                const newTrip = await Trip.create({
                    customerId: data.customerId,
                    driverId: socket.userId,
                    pickupLocation: {
                        address: data.pickupLocation.address,
                        coordinates: [data.pickupLocation.lng, data.pickupLocation.lat]
                    },
                    dropoffLocation: {
                        address: data.dropoffLocation.address,
                        coordinates: [data.dropoffLocation.lng, data.dropoffLocation.lat]
                    },
                    tripType: data.tripType,
                    calculatedFare: data.estimatedFare,
                    status: 'accepted',
                    otp: otp
                });

                const driverInfo = await User.findById(socket.userId).select('fullName phoneNumber');

                // 1. Notify the Customer
                io.to(data.customerSocketId).emit('ride-accepted', {
                    tripId: newTrip._id,
                    driverName: driverInfo.fullName,
                    driverPhone: driverInfo.phoneNumber,
                    otp: otp
                });

                // 2. Notify the Driver who accepted
                socket.emit('accept-success', { tripId: newTrip._id });

                // 3. Remove request from other drivers' screens
                socket.broadcast.emit('request-taken', { tripId: newTrip._id });

            } catch (error) {
                console.error('Error accepting ride:', error);
            }
        });

        // Handle Live Location Tracking
        socket.on('update-location', (data) => {
            if (socket.role === 'driver') {
                // Broadcast update-location to all listening customers/clients
                // Data includes: { tripId, location: { lat, lng } }
                io.emit('driver-location-update', {
                    tripId: data.tripId,
                    location: data.location
                });
            }
        });

        // Handle Status Update Broadcasting
        socket.on('update-trip-status', (data) => {
            // Broadcast status change so customer side updates immediately
            // Data includes: { tripId, status }
            io.emit('trip-status-updated', {
                tripId: data.tripId,
                status: data.status
            });
        });

        // --- REAL TIME CHAT ---
        socket.on('send-message', async (data) => {
            try {
                const { tripId, text, senderName } = data;
                const trip = await Trip.findById(tripId);
                if (!trip) return;

                const message = {
                    senderId: socket.userId,
                    senderName,
                    text,
                    timestamp: new Date()
                };

                trip.messages.push(message);
                await trip.save();

                // Broadcast to both parties
                io.emit('new-message', { tripId, message });
            } catch (err) {
                console.error('Chat error:', err);
            }
        });

        // --- GLOBAL SUPPORT CHAT ---
        socket.on('send-support-message', (data) => {
            const { text, senderName, isAdmin } = data;
            const message = {
                senderId: socket.userId,
                senderName,
                text,
                isAdmin,
                timestamp: new Date(),
                userId: isAdmin ? data.targetUserId : socket.userId // Context for admin
            };

            // Broadcast to the specific user's support channel
            const channelId = `support:${message.userId}`;
            io.emit('new-support-message', message);
            console.log(`[SUPPORT] Message in channel ${channelId}: ${text}`);
        });

        // Handle Ride Cancellation
        socket.on('cancel-ride', (data) => {
            console.log(`[SOCKET] Ride Cancelled by ${socket.role}: ${socket.userId}`);
            
            // 1. Remove from active requests if it's a search-phase cancellation
            if (activeRequests.has(socket.userId)) {
                activeRequests.delete(socket.userId);
            }

            // 2. Broadcast to all drivers that this request is no longer available
            io.emit('request-cancelled', { customerId: socket.userId });
        });

        socket.on('disconnect', async () => {
            // Update DB: Set Offline
            await User.findByIdAndUpdate(socket.userId, { isOnline: false });

            if (socket.role === 'driver') {

                onlineDrivers.delete(socket.userId);
                console.log(`Driver ${socket.userId} is OFFLINE`);
            }
        });
    });
};

module.exports = socketHandler;
