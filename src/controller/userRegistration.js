const registerUser = require("../models/userModel")


const signIN = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(req.body)

        if (!name) {
            return res.status(400).send({ status: false, data: "name is require" })
        }
        if (!email) {
            return res.status(400).send({ status: false, data: "Email is require" })
        } if (!password) {
            return res.status(400).send({ status: false, data: "Password is require" })
        }

        const data = await registerUser.create(req.body)
        return res.status(201).send({ status: true, data: data })


    } catch (err) {
        return res.status(500).send({ status: false, data: err.message })

    }
}


const logIN = async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).send({ status: false, data: "Email is require" })
        }
        if (!password) {
            return res.status(400).send({ status: false, data: "Password is require" })
        }

        const check = await registerUser.findOne(req.body)

        if (!check) {
            return res.status(400).send({ status: false, data: "user Not Found" })
        }

        return res.status(200).send({ status: true, data: "login successfully" })

    } catch (err) {
        return res.status(500).send({ status: false, data: err.message })

    }

}



module.exports = { signIN, logIN }