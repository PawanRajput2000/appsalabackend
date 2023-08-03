const CategorySchema = require("../models/category")


const savecategory = async(req,res)=>{
    try {
        const body  = req.body

        let data = await CategorySchema.create(body)
        return res.json({status : true , data : data})
    }catch(err){
        console.log(err.message)
      return res.json({status : false , data : err.message})
    }
}


const fetchcategory =async(req,res)=>{
    try {
        let data = await CategorySchema.find()
        return res.json({status : true , data :data})  
    }catch(err){
   return res.json({status : false , data :err.message})
    }
}

module.exports = {savecategory,fetchcategory}