const appSchema = require("../models/appschema")

const saveProduct = async (req, res) => {
    try {
        let formData = req.body
        console.log(formData.name)
        let checkUnique = await appSchema.findOne({name:formData.name})
        console.log(checkUnique)
        if(checkUnique){
            return res.status(400).json({ status: true, data: "name should be unique" }) 
        }
        
        let data = await appSchema.create(formData)
        return res.status(201).json({ status: true, data: data })

    } catch (err) {
        console.group(err.message)
        return res.status(500).json({ status: true, data: err.message })
    }
}

const getProduct = async (req, res) => {
    try {
        let data = await appSchema.find();
        if(!data){
            return res.status(500).send({ status: false, data: "No Data Found"})
        }


        data = data.map((app) => {
            const ratings = Object.values(app.rating);
            const validRatings = ratings.filter((rating) => !isNaN(rating));
            const totalRatings = validRatings.reduce((sum, rating) => sum + rating, 0);
            const averageRating = totalRatings / validRatings.length;

            return {
                ...app.toObject(),
                averageRating: isNaN(averageRating) ? 0 : averageRating.toFixed(1),
            };
        });

        return res.status(200).json({ status: true, data: data });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ status: false, data: err.message });
    }
};



const productDetails = async (req, res) => {
    try {
        let slug = req.params.slug
        let data = await appSchema.findOne({ slug: slug })
        if(!data){
            return res.status(500).send({ status: false, data: "No Data Found"})
        }
        return res.status(200).send({ status: true, data: data })
    } catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
}




module.exports = { getProduct, saveProduct, productDetails}