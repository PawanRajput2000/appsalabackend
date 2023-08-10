const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const userSchema = require("../src/models/userModel")
const ObjectId = mongoose.Types.ObjectId



const authentication = async (req, res, next) => {
    try {
        const token = req.headers["x-api-token"]
        if (!token) {
            return res.status(404).send({ status: false, data: "Token must be provided" })

        }

        let decodetoken = jwt.verify(token, "osnil web solution")
        req.decodeToken = decodetoken
        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const authorisation = async (req, res, next) => {
    try {
        let userId = req.params.userId
        if (userId === ":userId") {
            return res.status(400).send({ status: false, data: "userId required" })
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({
                status: false, data: "please enter valid userID"
            })
        }
        const getUser = await userSchema.findById(userId)
        if (!getUser) {
            return res.status(404).send({ status: false, data: "user not exist" })

        }
        if (req.decodeToken.userId !== userId) {
            return res.status(403).send({ status: false, data: "not authorized" })
        }

        next()

    } catch (err) {
      return res.status(500).send({status:false,data:err.message})
    }
}

module.exports ={authentication,authorisation}