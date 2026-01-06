const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`Socket 'join' received: User ${userId} (${userType}) on Socket ${socket.id}`);
            
            if (userType === 'user') {
                const res = await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log(`Updated User ${userId} with Socket ${socket.id}. Result: ${res ? 'Success' : 'Failed (User not found)'}`);
            } else if (userType === 'captain') {
                const res = await captainModel.findByIdAndUpdate(userId, { 
                    socketID: socket.id,
                    status: 'active' // Set captain as active when they connect
                });
                console.log(`Updated Captain ${userId} with Socket ${socket.id}. Result: ${res ? 'Success' : 'Failed (Captain not found)'}`);
                console.log(`✅ Captain ${userId} is now ACTIVE and available for rides`);
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.lat || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    lat: location.lat,
                    lng: location.lng
                },
                socketID: socket.id
            });
        });

        socket.on('update-location-user', async (data) => {
            const { userId, location } = data;

            if (!location || !location.lat || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            console.log(`Updating user ${userId} location:`, location);

            await userModel.findByIdAndUpdate(userId, {
                location: {
                    lat: location.lat,
                    lng: location.lng
                },
                socketId: socket.id
            });
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            
            // Set captain as inactive if they disconnect
            await captainModel.findOneAndUpdate(
                { socketID: socket.id },
                { status: 'inactive' }
            );
        });
    });
}

function sendMessageToSocketId(socketId, messageObject) {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };
