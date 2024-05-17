const socketIO = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, { transports: ['websocket', 'polling'] });
const mongoose = require('mongoose');
const Messages = require('../backend/model/messages');
const Conversation = require('../backend/model/conversation');

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

const isAdminOnline = (adminId) => {
  return users.some((user) => user.userId === adminId);
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, text, images }) => {
    const user = getUser(receiverId);
    const isAdmin = await isAdminCheck(senderId);

    if (!isAdmin && !isAdminOnline(receiverId)) {
      const autoResponse = getAutoResponse(text);
      const messageData = {
        sender: receiverId,
        text: autoResponse,
        conversationId: await getConversationId(senderId, receiverId),
      };

      const autoMessage = new Messages(messageData);
      await autoMessage.save();

      io.to(socket.id).emit('getMessage', {
        senderId: receiverId,
        text: autoResponse,
        images: null,
        createdAt: Date.now(),
      });

      await updateLastMessage(
        messageData.conversationId,
        autoResponse,
        receiverId
      );
    }

    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
        images,
        createdAt: Date.now(),
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

const isAdminCheck = async (userId) => {
  const User = mongoose.model('User', new mongoose.Schema({ role: String }));
  const user = await User.findById(userId);
  return user.role === 'admin';
};

const getAutoResponse = (userMessage) => {
  const faqs = [
    {
      question: 'how to order',
      response:
        'You can order by selecting products and adding them to your cart.',
    },
    {
      question: 'how to refund',
      response:
        'To initiate a refund, please contact our support team with your order details.',
    },
  ];

  const matchedFaq = faqs.find((faq) =>
    userMessage.toLowerCase().includes(faq.question)
  );
  return matchedFaq
    ? matchedFaq.response
    : 'Thank you for your message. We will get back to you soon.';
};

const getConversationId = async (userId, adminId) => {
  const conversation = await Conversation.findOne({
    members: { $all: [userId, adminId] },
  });
  return conversation._id;
};

const updateLastMessage = async (conversationId, lastMessage, senderId) => {
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage,
    lastMessageId: senderId,
  });
};

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
