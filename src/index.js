const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const router = require("./routes/routes");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Use the Socket.IO server instance in your API functions
const commentController = require("./controller/commentController");
commentController.setSocket(io);

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse JSON-encoded bodies and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle file uploads using Multer
app.use(multer().any());

// MongoDB Atlas connection
mongoose.connect(
  "mongodb+srv://indiaProject:LEsbp5k9osyQcp6Q@indiaproject.1go0lry.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB is connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("newComment", (comment) => {
    socket.broadcast.emit("newComment", comment);
  });

  socket.on("commentDeleted", (commentId) => {
    socket.broadcast.emit("commentDeleted", commentId);
  });

  // ... Add more event handling here
});

// Use the router for handling routes
app.use("/", router);

// Handle 404 errors
app.use((req, res) =>
  res.status(404).json({ status: false, message: "Invalid path URL" })
);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Express app running on port ${PORT}`);
});
