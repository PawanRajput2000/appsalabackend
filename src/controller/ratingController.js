const rating = require("../models/rating");
const User = require("../models/userModel")

const createRating = async (req, res) => {
    try {
      const userId = req.decoded.userId;
      const applicationId = req.params.applicationId;
      const ratingValue = req.body.rating;
  
      const data = {
        userId: userId,
        applicationId: applicationId,
        rating: ratingValue
      };
  
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
  
      // ... (rest of your code for updating user's following_app array)
  
      // Save the user with updated saved and following_app arrays
      await user.save();
  
      // Find the specific following_app object for the given application
      let followingApp = user.following_app.find(
        app => app.obj_id.toString() === applicationId
      );
  
      if (!followingApp) {
        return res.status(404).json({ error: "Following app not found" });
      }
  
      // Update the user_ratings array with the new or updated rating
      const existingRatingIndex = followingApp.subscription.user_ratings.findIndex(
        r => r.applicationId === applicationId
      );
  
      if (existingRatingIndex !== -1) {
        // Update the existing rating
        followingApp.subscription.user_ratings[existingRatingIndex].rating = ratingValue;
      } else {
        // Add a new rating
        followingApp.subscription.user_ratings.push(data);
      }
  
      // Save the user with updated subscription and user_ratings arrays
      await user.save();
  
      res.status(200).send({ status: true, data: "Rating added/updated successfully." });
    } catch (err) {
        console.log(err.message)
      res.status(500).send({ status: false, data: err.message });
    }
  };
  

module.exports = { createRating };
