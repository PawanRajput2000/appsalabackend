const Comment = require("../models/commentSchema")
const User = require("../models/userModel")



const createComment = async (req, res) => {
    try {
      const userId = req.params.userId;
      const applicationId = req.params.applicationId;
      const commentText = req.body.comment;
  
      const data = {
        userId: userId,
        applicationId: applicationId,
        comment: commentText
      };
  
      // Save the new comment to the database
      const savedComment = await Comment.create(data);
  
      // Find the user and update the correct nested comments array
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const followingApp = user.following_app.find(app => app.obj_id.toString() === applicationId);
  
      if (!followingApp) {
        return res.status(404).json({ error: "Application not found for the user" });
      }
  
      if (!followingApp.subscription) {
        followingApp.subscription = {};
      }
  
      if (!followingApp.subscription.comment) {
        followingApp.subscription.comment = [];
      }
  
      followingApp.subscription.comment.push(savedComment._id);
      await user.save();
  
      res.json({ message: "Comment added successfully." });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  module.exports = { createComment };
  
  