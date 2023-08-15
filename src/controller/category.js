const CategorySchema = require("../models/category")


const savecategory = async (req, res) => {
    try {
        const body = req.body

        let data = await CategorySchema.insertMany(body)
        return res.json({ status: true, data: data })
    } catch (err) {
        console.log(err.message)
        return res.json({ status: false, data: err.message })
    }
}


const fetchSubcategory = async (req, res) => {
    try {
        let data = await CategorySchema.find();

        // Fetch all category data
        data = data.map((item) => ({
            ...item.toObject(),
            _id: item._id.toString(), // Convert ObjectId to string for better representation
        }));

        // Function to filter categories with non-empty subCategory_ids
        const filterNonEmptySubcategories = (category) => {
            return category.subCategory_ids && category.subCategory_ids.length == 0;
        };

        // Filter categories with non-empty subCategory_ids
        const categoriesData = data.filter(filterNonEmptySubcategories);

        // Respond with the filtered data
        return res.json({ status: true, data: categoriesData });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



const fetchCategory = async (req, res) => {
    try {
        let data = await CategorySchema.find().populate("subCategory_ids");

        // Fetch all category data
        data = data.map((item) => ({
            ...item.toObject(),
            _id: item._id.toString(), // Convert ObjectId to string for better representation
        }));                

        // Function to filter categories with non-empty subCategory_ids
        const filterNonEmptySubcategories = (category) => {
            return category.subCategory_ids && category.subCategory_ids.length > 0;
        };

        // Filter categories with non-empty subCategory_ids
        const finalData = data.filter(filterNonEmptySubcategories);


        // Respond with the filtered data
        return res.json({ status: true, data: finalData });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


module.exports = { savecategory, fetchSubcategory, fetchCategory }