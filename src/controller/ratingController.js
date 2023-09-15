const rating = require("../models/rating");
const User = require("../models/userModel")
const App = require("../models/appschema")

const createRating = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const applicationId = req.params.applicationId;
    const ratingValue = req.body.rating;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the application is in the user's saved array
    const savedAppIndex = user.saved.indexOf(applicationId);
    if (savedAppIndex !== -1) {
      // Remove the application from the saved array
      user.saved.splice(savedAppIndex, 1);
    }

    // Save the user with updated saved array
    await user.save();

    // Find the specific application
    const app = await App.findById(applicationId);

    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Create or update the rating
    const existingRating = await rating.findOneAndUpdate(
      { userId: userId, applicationId: applicationId },
      { $set: { rating: ratingValue } },
      { new: true, upsert: true }
    );

    // Check if the user is following the application
    let followingApp = user.following_app.find(
      (app) => app.obj_id.toString() === applicationId
    );

    if (!followingApp) {
      // If not following, create a new following_app entry
      followingApp = {
        obj_id: app._id,
        status: "Maybe 🤔", // Default status
        subscription: {
          date: Date.now(),
          amount: 0,
          duration: "unknown", // You can set a default value
          package: "trying", // Default package
          comment: [], // Empty comment array
          user_ratings: [existingRating._id], // Include the rating
        },
      };

      // Add to following_app array
      user.following_app.push(followingApp);
    } else {
      // If already following, update the user_ratings array
      if (!followingApp.subscription.user_ratings.includes(existingRating._id)) {
        followingApp.subscription.user_ratings.push(existingRating._id);
      }
    }

    // Save the user with updated following_app array
    await user.save();

    res.status(200).send({ status: true, data: "Rating added/updated successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ status: false, data: err.message });
  }
};

  
  module.exports = { createRating };
  