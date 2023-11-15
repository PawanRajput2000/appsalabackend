const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userSchema = require("../src/models/userModel");
const ObjectId = mongoose.Types.ObjectId;

const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: false, data: "Token must be provided" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, "osnilWebSolution", (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: false, message: "JWT verification failed", error: err.message });
            }

            req.decoded = decoded;
            next();
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ status: false, message: "Internal Server Error", error: err.message });
    }
};


const authorisation = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        if (userId === ":userId") {
            return res.status(400).send({ status: false, data: "userId required" });
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({
                status: false, data: "please enter valid userID"
            });
        }
        const getUser = await userSchema.findById(userId);
        if (!getUser) {
            return res.status(404).send({ status: false, data: "user not exist" });
        }
        if (req.decoded.userId !== userId) {
            return res.status(403).send({ status: false, data: "not authorized" });
        }

        next();
    } catch (err) {
        return res.status(500).send({ status: false, data: err.message });
    }
};

module.exports = { authentication, authorisation };
