const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")


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

        const data = await userModel.create(req.body)
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
       
        const DB = await userModel.findOne(req.body)

        if (!DB) {
            return res.status(400).send({ status: false, data: "user Not Found" })
        }

        let userId = DB._id
        let token = jwt.sign({
            userId:userId
        },"osnilWebSolution")
        
        //set token inside header 
        res.setHeader("x-api-token",token)
        let data = {
            token: token,
            userId: DB._id.toString(),
          }
        return res.status(200).send({ status: true, data:data  })

    } catch (err) {
        return res.status(500).send({ status: false, data: err.message })

    }

}

const following_app = async (req, res) => {
    try {
      const userId = req.params.userId;
      const updatedFollowingApp = req.body.following_app;
  
      // Update the user's following_app section
      await userModel.findByIdAndUpdate(
        userId,
        { following_app: updatedFollowingApp },
        { new: true }
      );
  
      res.json({ message: "Following app updated successfully." });
    } catch (error) {
        console.log(error.message)
      res.status(500).json({ error: "Internal server error" });
    }
  }



  const getProfileDetails = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const userWithComments = await userModel.findById(userId)
        .populate({
          path: "following_app.obj_id",
        })
        .populate({
          path: "following_app.status",
        })
        .populate({
          path: "following_app.subscription.comment",
          populate: {
            path: "userId",
            model: "user",
            select: "name",
          },
        })
        .populate("saved") // Populate the "saved" field with app details
        .select("-password");
  
      if (!userWithComments) {
        return res.status(404).json({ error: "User not found" });
      }
  
      
      res.json({ status: true, data: userWithComments });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  
  




module.exports = { signIN, logIN,getProfileDetails , following_app}  