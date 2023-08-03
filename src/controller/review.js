const text = require("../models/textSchema")



const review = async (req, res) => {


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






module.exports = { review }