const text = require("../models/textSchema")



const savetext = async (req, res) => {


    try {
        const { content } = req.body
        if (!content) {
            return res.json({ status: false, data: "field cannot be empty" })
        }

        let data = await text.create({ content })
        return res.json({ status: true, data: data })

    } catch (err) {
        return res.json({ status: false, data: "internal server err" })
    }
}


const gettext = async (req, res) => {
    try {
        const _id = req.body.id
        const data = await text.findById(_id)
        return res.json({ status: true, data: data })

    } catch (err) {
        return res.json({ status: false, data: err.message })

    }
}





module.exports = { savetext, gettext }