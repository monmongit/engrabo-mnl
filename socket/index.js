const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require('dotenv').config({
  path: './.env',
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world from socket server');
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

// Define a message object with a seen property
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on('connection', (socket) => {
  // When connect
  console.log(`a user is connected`);

  // Take userId and socketId
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  // Send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });
    const receiver = getUser(receiverId);

    console.log(`Attempting to send message from ${senderId} to ${receiverId}`);

    if (receiver) {
      console.log('Found receiver with socket ID:', receiver.socketId);
      io.to(receiver.socketId).emit('getMessage', message);
    } else {
      console.log('Receiver not found for ID:', receiverId);
    }
  });

  socket.on('messageSeen', ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId);

    // Update the seen flag for the message
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (message) =>
          message.receiverId === receiverId && message.id === messageId
      );
      if (message) {
        message.seen = true;
      }

      // Send a message seen event to the sender
      io.to(user?.socketId).emit('messageSeen', {
        senderId,
        receiverId,
        messageId,
      });
    }
  });
  // Update and get last message
  socket.on('updateLastMessage', ({ lastMessage, lastMessageId }) => {
    io.emit('getLastMessage', {
      lastMessage,
      lastMessageId,
    });
  });

  // Disconnet user
  socket.on('disconnect', () => {
    console.log(`User is disconnected!`);
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`server is running on port ${process.env.PORT || 4000}`);
});
