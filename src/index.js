const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const router = require("./routes/routes");
const cors = require("cors")
const app = express();

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

app.use("/", router);

app.use((req, res) =>
  res.status(404).send({ status: false, message: "invalid Path url" })
);

app.listen(5000, function () {
  console.log("Express app running on port " + 5000);
});
