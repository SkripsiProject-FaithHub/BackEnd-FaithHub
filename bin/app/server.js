const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('../helpers/databases/connection');
const authRoutes = require('./routes/user');
const questionRoutes = require('./routes/question');
const articleRoutes = require('./routes/article');
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
// var upload = multer();

const app = express();
const server = require('http').createServer(app); // Using the server from index.js

app.use(
  cors({
    origin: "http://localhost:9000",
    credentials: true,
  })
);

const storage = multer.memoryStorage(); // Use memory storage for processing files
const upload = multer({ storage: storage });

const io = new Server(server, {
  secure: true,
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket connected");
  const users = [];

  for (let [id, socket] of io.of("/").sockets) {
    if (socket.handshake.auth.userId) {
      users.push({
        ...socket.handshake.auth,
        socketId: socket.handshake.auth.userId,
      });
    }
  }

  console.log("users", users);
  io.emit("user-connected", users);

  socket.on("join-room", ({ room, user }) => {
    users[user.userId] = user;
    socket.join(room);
  });

  socket.on("send-message", ({ message, room, user }) => {
    console.log("message", message, room, user);
    io.to(room).emit("receive-message", { message, user, room });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    const delUser = users.filter(
      (user) => user.socketId !== socket.handshake.auth.userId
    );
    console.log("disconnected users", delUser);
    io.emit("user-disconnected", delUser);
  });
});

connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
app.use(upload.array()); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/article', articleRoutes);

module.exports = app;