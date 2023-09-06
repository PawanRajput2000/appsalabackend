const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")


const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log(req.body)

    if (!name) {
      return res.status(400).send({ status: false, data: "name is require" })
    }
    if (!email) {
      return res.status(400).send({ status: false, data: "Email is require" })
    }
    if (!password) {
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
      userId: userId
    }, "osnilWebSolution")

    //set token inside header 
    res.setHeader("x-api-token", token)
    let data = {
      token: token,
      userId: DB._id.toString(),
    }
    return res.status(200).send({ status: true, data: data })

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

    const userWithDetails = await userModel.findById(userId)
      .populate({
        path: "following_app.obj_id",
      })
      .populate({
        path: "following_app.subscription.comment",
        populate: {
          path: "userId",
          model: "user",
          select: "name",
        },
      })
      .populate({
        path: "following_app.subscription.user_ratings",
        model: "rating",
        select: "rating",
      })
      .populate("saved")
      .select("-password");

    if (!userWithDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ status: true, data: userWithDetails });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Update user's name, email, and password (optional)
const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { currentPassword, newPassword, name, email } = req.body;

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ status: false, data: 'User not found' });
    }

    if (currentPassword) {
      if (user.password !== currentPassword) {
        return res.status(401).json({ status: false, data: 'Current password is incorrect' });
      }
    }

    // Update name, email, and password if provided
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (newPassword) {
      user.password = newPassword;
    }

    await user.save();

    return res.json({ status: true, data: 'User information updated successfully', user });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ status: false, data: 'Internal server error' });
  }
};






const updateApplicationStatus = async (req, res) => {
  try {
    // Find the user by their ID
    const userId = req.decoded.userId;
    const applicationId = req.params.applicationId;
    const newStatus = req.body.status; // Use req.body.status

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find the application within the "following_app" array by its ID
    const application = user.following_app.find((app) =>
      app.obj_id.equals(applicationId)
    );

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // Update the status of the application
    application.status = newStatus;

    // Save the user with the updated application status
    await user.save();

    return res.json({
      success: true,
      message: "Application status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Define an API endpoint to update the subscription details
const updatePricingInfoInUserSchema = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const { applicationId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the specific application within the following_app array
    const application = user.following_app.find((app) =>
      app.obj_id.equals(applicationId)
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update the subscription details
    if (req.body.date) {
      application.subscription.date = new Date(req.body.date);
    } else {
      application.subscription.date = new Date();
    }

    application.subscription.amount = req.body.amount || 0; // You can get this from the request body
    application.subscription.duration = req.body.duration || 0; // You can get this from the request body
    application.subscription.package = req.body.package || 'trying'; // You can get this from the request body

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Subscription details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




module.exports = {
  signup, logIN, getProfileDetails, following_app,
  updateUser, updateApplicationStatus,
  updatePricingInfoInUserSchema
}  