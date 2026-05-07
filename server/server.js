const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const packageRoutes = require('./routes/package.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Designated Driver API is running...');
});

// Socket.io initialization
const socketHandler = require('./socket');
socketHandler(io);

// Database Connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.log(err));
