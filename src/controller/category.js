const CategorySchema = require("../models/category")
const App = require("../models/appschema")

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
        // Fetch all categories from the CategorySchema
        let categories = await CategorySchema.find();

        // Fetch all unique categories from the App schema
        const uniqueCategories = await App.distinct("Category");

        // Filter categories to include only those that have a corresponding category in the App schema
        const filteredCategories = categories.filter(category => {
            return uniqueCategories.includes(category.name);
        });

        // Respond with the filtered categories
        return res.json({ status: true, data: filteredCategories });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};




// const fetchCategory = async (req, res) => {
//     try {
//         let data = await CategorySchema.find().populate("subCategory_ids");

//         // Fetch all category data
//         data = data.map((item) => ({
//             ...item.toObject(),
//             _id: item._id.toString(), // Convert ObjectId to string for better representation
//         }));                

//         // Function to filter categories with non-empty subCategory_ids
//         const filterNonEmptySubcategories = (category) => {
//             return category.subCategory_ids && category.subCategory_ids.length > 0;
//         };

//         // Filter categories with non-empty subCategory_ids
//         const finalData = data.filter(filterNonEmptySubcategories);


//         // Respond with the filtered data
//         return res.json({ status: true, data: finalData });
//     } catch (err) {
//         console.log(err.message);
//         return res.status(500).json({ status: false, message: "Internal Server Error" });
//     }
// };

const fetchCategory = async (req, res) => {
    try {
        // Fetch all categories from the CategorySchema
        let categories = await CategorySchema.find().populate("subCategory_ids");

        // Fetch the slugs of existing categories from the App schema
        let existCategorySlugs = await App.find().distinct("Category");
        
        // Filter categories based on whether any sub-category's slug matches with existCategorySlugs
        const filteredCategories = categories.filter(category => {
            return category.subCategory_ids.some(subCategory => existCategorySlugs.includes(subCategory.slug));
        });

        const finalFiltered = filteredCategories.filter(category => category.subCategory_ids.length > 0);

        return res.json({ status: true, data: finalFiltered });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



module.exports = { savecategory, fetchSubcategory, fetchCategory }