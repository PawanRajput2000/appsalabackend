const express = require("express")
const app = express()
const mongoose = require("mongoose")
const router = require("./routes/routes")
const cors = require("cors")
const multer = require ('multer');

app.use(express.json())
app.use(cors())

app.use (multer().any())
mongoose.connect("mongodb+srv://indiaProject:LEsbp5k9osyQcp6Q@indiaproject.1go0lry.mongodb.net/", { useNewUrlParser: true }).then(() => {
    console.log("connected to DB ")
}).catch(err => console.log(err.message))


app.use("/", router)

app.listen(5000, () => {
    console.log("server started on port 5000")  
})   