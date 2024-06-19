const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import cors module
const connectDB = require('./bin/helpers/databases/connection');
const authRoutes = require('./bin/app/routes/user');
const questionRoutes = require('./bin/app/routes/question');
const articleRoutes = require('./bin/app/routes/article');
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 9001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow requests from any frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Use CORS middleware
app.use(cors());

app.use(upload.array());
app.use(express.json());

// Define a route for the root (/) endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Socket.io connection handling
io.on("connection", (socket) => {
  // Your existing socket.io logic here
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/article', articleRoutes);

// Database connection
connectDB();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});