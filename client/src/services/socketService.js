import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (this.socket) {
            // If token is same, do nothing
            if (this.socket.auth?.token === token) return;
            // If token changed, disconnect old one first
            this.disconnect();
        }
        
        console.log('Attempting to connect to Socket Server at:', SOCKET_URL);
        console.log('Using Token:', token ? 'Token Present' : 'MISSING TOKEN');

        this.socket = io(SOCKET_URL, {
            auth: { token }
        });
        
        this.socket.on('connect', () => {
            console.log('✅ Connected to socket server successfully! Socket ID:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket Connection Error:', err.message);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event) {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

const socketService = new SocketService();
export default socketService;
