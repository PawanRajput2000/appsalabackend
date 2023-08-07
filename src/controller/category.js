const CategorySchema = require("../models/category")


const savecategory = async(req,res)=>{
    try {
        const body  = req.body

        let data = await CategorySchema.insertMany(body)
        return res.json({status : true , data : data})
    }catch(err){
        console.log(err.message)
      return res.json({status : false , data : err.message})
    }
}


const fetchcategory = async (req, res) => {
    try {
      let data = await CategorySchema.find();
  
      // Create a new ID for each data entry
      data = data.map((item) => ({
        ...item.toObject(),
        _id: item._id.toString(), // Convert ObjectId to string for better representation
      }));
  
      // Filter data where parent_id is not equal to null
      const filteredData = data.filter((item) => item.parent_id !== null);
  
      return res.json({ status: true, data: filteredData });
    } catch (err) {
      return res.json({ status: false, data: err.message });
    }
  };
  

module.exports = {savecategory,fetchcategory}