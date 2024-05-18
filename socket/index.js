const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, { transports: ['websocket', 'polling'] }); // ensure transports fallback
// const Messages = require('../backend/model/messages');

require('dotenv').config({
  path: './.env',
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world from socket server!');
});

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const handleAutomaticResponse = (messageText, senderId, receiverId) => {
  let responseText = '';
  if (messageText.toLowerCase().includes('how to order')) {
    responseText =
      'To place an order, please browse our catalog, add items to your cart, and proceed to checkout.';
  } else if (messageText.toLowerCase().includes('how to refund')) {
    responseText =
      'To request a refund, please visit your order history, select the order, and click on "Request Refund".';
  } // Add more conditions as needed

  if (responseText) {
    const user = getUser(senderId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId: receiverId, // Admin ID
        text: responseText,
        images: null,
        createdAt: Date.now(),
      });
    }
  }
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text, images }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
        images,
        createdAt: Date.now(),
      });

      // Handle automatic response
      handleAutomaticResponse(text, receiverId, senderId); // Check and send automatic response
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
