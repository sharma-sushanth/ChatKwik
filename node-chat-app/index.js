const express = require('express');
const cors = require('cors');
const app = express();
const server = app.listen(3017, () => console.log('Server listening on port 3017'));
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3002", // Update this to your React app's URL
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: "http://localhost:3002" // Update this to your React app's URL
}));

let clients = [];
let messageList = [];

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    clients.push(socket);
    socket.emit('messageList', messageList);

    socket.on('onMessage', (data) => {
        console.log('Message received:', data.message, 'from', socket.id);
        messageList.push({
            message: data.message,
            senderId: socket.id
        });
        clients.forEach((client) => client.emit('messageList', messageList));
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        clients = clients.filter((client) => client.id !== socket.id);
    });
});
