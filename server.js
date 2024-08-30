const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let currentState = 'Front';

io.on('connection', (socket) => {
    console.log('Client connected');

    // Send the current state to the new client
    socket.emit('update', currentState);

    // Handle state changes from clients
    socket.on('toggle', (state) => {
        currentState = state;
        io.emit('update', currentState); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
