const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const router = require("./routes/routes");
const cors = require("cors")
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server)

app.use(cors())
app.use(express.json());
app.use(multer().any());

app.use(express.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://indiaProject:LEsbp5k9osyQcp6Q@indiaproject.1go0lry.mongodb.net/",
  { useNewUrlParser: true }
)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err.message));


io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle real-time events here
  socket.on("newComment", (comment) => {
    socket.broadcast.emit("newComment", comment);
  });

  socket.on("commentDeleted", (commentId) => {
    socket.broadcast.emit("commentDeleted", commentId);
  });

  // ... Add more event handling here as needed
});

app.use("/", router);

app.use((req, res) =>
  res.status(404).send({ status: false, message: "invalid Path url" })
);

app.listen(5000, function () {
  console.log("Express app running on port " + 5000);
});
