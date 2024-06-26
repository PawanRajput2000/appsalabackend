const Rating = require("../models/rating");
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

    // Find the specific application
    const app = await App.findById(applicationId);

    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Create or update the rating
    const existingRating = await Rating.findOneAndUpdate(
      { userId: userId, applicationId: applicationId },
      { $set: { rating: ratingValue } },
      { new: true, upsert: true }
    );

    // Check if the user is following the application
    let followingApp = user.following_app.find(
      (app) => app.obj_id.toString() === applicationId
    );

    // If following the app, update its subscription with the rating
    if (followingApp) {
      // Ensure necessary structures are initialized
      if (!followingApp.subscription) {
        followingApp.subscription = {
          date: Date.now(),
          amount: 0,
          duration: "unknown",
          package: "trying",
          comment: [],
          user_ratings: []
        };
      }

      if (!followingApp.subscription.user_ratings) {
        followingApp.subscription.user_ratings = [];
      }

      // Add the rating to the subscription array
      followingApp.subscription.user_ratings.push(existingRating._id);

      // Save the user with the updated "following_app" array
      await user.save();
    } 
    res.status(200).send({ status: true, data: "Rating added/updated successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ status: false, data: err.message });
  }
};



module.exports = { createRating };

