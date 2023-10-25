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

    // Check if the user has the application in saved
    let savedApp = user.saved.find(
      (app) => app.obj_id.toString() === applicationId
    );

    // Check if the user is following the application
    let followingApp = user.following_app.find(
      (app) => app.obj_id.toString() === applicationId
    );

    // If the app is in both saved and following_app, update both
    if (savedApp && followingApp) {
      savedApp.subscription.user_ratings.push(existingRating._id);
      followingApp.subscription.user_ratings.push(existingRating._id);
    } else {
      // If not in both, update them individually
      if (savedApp) {
        savedApp.subscription.user_ratings.push(existingRating._id);
      } else {
        // If not in saved, create a new saved entry
        savedApp = {
          obj_id: app._id,
          status: "Maybe 🤔",
          comment: [],
          user_ratings: [existingRating._id],
        };
        user.saved.push(savedApp);
      }

      if (followingApp) {
        followingApp.subscription.user_ratings.push(existingRating._id);
      } else {
        // If not in following_app, create a new following_app entry
        followingApp = {
          obj_id: app._id,
          status: "Maybe 🤔",
          subscription: {
            date: Date.now(),
            amount: 0,
            duration: "unknown",
            package: "trying",
            comment: [],
            user_ratings: [existingRating._id],
          },
        };
        user.following_app.push(followingApp);
      }
    }

    // Save the user with updated saved and following_app arrays
    await user.save();

    res.status(200).send({ status: true, data: "Rating added/updated successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ status: false, data: err.message });
  }
};

module.exports = { createRating };

