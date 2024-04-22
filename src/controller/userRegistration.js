const userModel = require("../models/userModel")
const Rating = require("../models/rating")
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
    let checkUnique = await userModel.findOne({email: email})
    if(checkUnique){
      return res.status(400).send({ status: false, data: "email should be unique" })
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

    // Check if following_app exists and has an obj_id before using toString
    userWithDetails.following_app.forEach((app) => {
      if (app.obj_id) {
        app.obj_id = app.obj_id.toString();
      }
    });

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
    const newStatus = req.body.status;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find the application within the "following_app" array by its ID
    let application;
    if (user.following_app) {
      application = user.following_app.find((app) =>
        app.obj_id.equals(applicationId)
      );
    }

    // Find the application within the "saved" array by its ID
    let savedApplication;
    if (user.saved) {
      savedApplication = user.saved.find((app) =>
        app.obj_id.equals(applicationId)
      );
    }

    if (!application && !savedApplication) {
      // Create a new rating object with default values
      const newRating = new Rating({
        userId: userId,
        applicationId: applicationId,
        rating: {
          Usability: 0,
          Performance: 0,
          Features: 0,
          Support: 0,
          Value: 0,
          Company: 0,
        },
      });

      // Save the new rating object
      await newRating.save();

      // Create a new following_app entry with the new status and add the rating object ID to user_ratings
      application = {
        obj_id: applicationId,
        status: newStatus,
        subscription: {
          date: Date.now(),
          amount: 0,
          duration: "trying",
          package: "trying",
        },
        user_ratings: [newRating._id], // Add the new rating object ID to user_ratings
      };

      // Add the application to "following_app"
      user.following_app.push(application);

      // Create a new saved entry with the new status and add the rating object ID to user_ratings
      savedApplication = {
        obj_id: applicationId,
        status: newStatus,
        comment: [], // You can customize this as needed
        user_ratings: [newRating._id], // Add the new rating object ID to user_ratings
      };

      // Add the application to "saved"
      user.saved.push(savedApplication);
    } else {
      // If the application is found in "following_app," update its status
      if (application) {
        application.status = newStatus;
      }

      // If the application is found in "saved," update its status
      if (savedApplication) {
        savedApplication.status = newStatus;
      }
    }

    // Save the user with the updated "following_app" and "saved"
    await user.save();

    return res.json({
      success: true,
      message: "Application status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




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

    // Validate and update the subscription details
    if (req.body.date) {
      const dateParts = req.body.date.split('-');
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Months are zero-based (0-11)
        const year = parseInt(dateParts[2]);

        // Validate if the parsed date components are valid
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const parsedDate = new Date(year, month, day);

          // Check if the parsedDate is a valid date
          if (!isNaN(parsedDate.getTime())) {
            application.subscription.date = parsedDate;
          } else {
            return res.status(400).json({ message: 'Invalid date format' });
          }
        } else {
          return res.status(400).json({ message: 'Invalid date format' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid date format' });
      }
    } else {
      application.subscription.date = new Date();
    }

    if (req.body.amount !== undefined) {
      application.subscription.amount = req.body.amount;
    }

    if (req.body.duration) {
      application.subscription.duration = req.body.duration;
    } else {
      return res.status(400).json({ message: 'Invalid duration format' });
    }

    if (req.body.package) {
      application.subscription.package = req.body.package;
    } else {
      application.subscription.package = 'trying';
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Subscription details updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  signup, logIN, getProfileDetails, following_app,
  updateUser, updateApplicationStatus,
  updatePricingInfoInUserSchema
}  