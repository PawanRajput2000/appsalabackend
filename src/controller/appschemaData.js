const appSchema = require("../models/appschema")
const { uploadFile } = require("../AWS/aws")

const saveProduct = async (req, res) => {
    try {
        let formData = req.body
        
        let files = req.files;    

       

        let checkUnique = await appSchema.findOne({ name: formData.slug })

        if (checkUnique) {
            return res.status(400).json({ status: false, data: "slug should be unique" })
        }

        if (files.length === 0 || files[0].fieldname !== "logo") {
            return res
                .status(400)
                .send({
                    status: false,
                    message: "required productImage as key and file as value",
                });
        }

        if (
            !(
                files[0].mimetype == "image/png" ||
                files[0].mimetype == "image/jpg" ||
                files[0].mimetype == "image/jpeg"
            )
        ) {
            return res.status(400).send({
                status: false,
                message: "Only .png, .jpg and .jpeg format allowed!",
            });
        }

        //uploading productImage file in AWS
        let uploadedFileURL = await uploadFile(files[0]);
        formData.logo = uploadedFileURL;

        //convert seller details section into object 
        let updateSeller = formData.sellerDetails
        formData.sellerDetails = JSON.parse(updateSeller)



        //convert appPricing Details
        let UpdateAppPricing = formData.appPricing
        formData.appPricing = JSON.parse(UpdateAppPricing)

        //convert appMedia Details
        let UpdateappMedia = formData.appMedia
        formData.appMedia = JSON.parse(UpdateappMedia)


        let saveData = await appSchema.create(formData)
       
        return res.status(201).json({ status: true, data: saveData })
        
    } catch (err) {
        console.log("500", err.message)
        return res.status(500).json({ status: false, data: err.message })
    }
}

const getProduct = async (req, res) => {
    try {
        let data = await appSchema.find();
        if (!data) {
            return res.status(500).send({ status: false, data: "No Data Found" })
        }

        // Rating calculation
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
        if (!data) {
            return res.status(500).send({ status: false, data: "No Data Found" })
        }
        return res.status(200).send({ status: true, data: data })
    } catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
}



const productListByCategory = async (req, res) => {

    try {
        let category = req.params.categoryname

        let data = await appSchema.find({ "Category": { $in: category } })

        if (data.length === 0) {
            return res.status(404).send({ status: false, data: "not found" })
        }

        return res.status(200).send({ status: true, data: data })

    } catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }

}




module.exports = { getProduct, saveProduct, productDetails, productListByCategory }