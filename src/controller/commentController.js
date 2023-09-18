
const Comment = require("../models/commentSchema");

const rating = require("../models/rating")
const User = require("../models/userModel")



const createComment = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const applicationId = req.params.applicationId;
    const commentText = req.body.comment;

    if (!applicationId) {
      return res.status(400).json({ status: false, data: "applicationId required" });
    }

    if (!commentText) {
      return res.status(400).json({ status: false, data: "Comment text required" });
    }

    // Construct the comment data
    const commentData = {
      userId: userId,
      applicationId: applicationId,
      comment: commentText
    };

    // Save the new comment to the database
    const savedComment = await Comment.create(commentData);

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, data: "User not found" });
    }

    // Find the specific application within the user's saved array
    let savedApp = user.saved.find(app => app.obj_id.toString() === applicationId);

    // Find the specific application within the user's following_app array
    let followingApp = user.following_app.find(app => app.obj_id.toString() === applicationId);

    // If the user is not already following the application, follow it
    if (!followingApp) {
      followingApp = {
        obj_id: applicationId,
        status: "Maybe 🤔",
        subscription: {
          comment: [savedComment._id]
        }
      };

      // Check if duration is not provided, and if so, set it to "0"
      if (!followingApp.subscription.duration) {
        followingApp.subscription.duration = "0";
      }

      user.following_app.push(followingApp);
    } else {
      // Ensure necessary structures are initialized
      if (!followingApp.subscription) {
        followingApp.subscription = {};
      }

      if (!followingApp.subscription.comment) {
        followingApp.subscription.comment = [];
      }

      // Add the comment to the subscription array
      followingApp.subscription.comment.push(savedComment._id);
    }

    // If the user has the application in saved, update it
    if (savedApp) {
      savedApp.subscription.comment.push(savedComment._id);
    } else {
      // If not in saved, create a new saved entry
      savedApp = {
        obj_id: applicationId,
        status: "Maybe 🤔",
        subscription: {
          comment: [savedComment._id]
        }
      };
      user.saved.push(savedApp);
    }

    // Save the user with updated saved and following_app arrays
    await user.save();

    // Send the comment to the frontend because it will reflect in the latest comment lists
    res.json({ status: true, message: "Comment added successfully.", comment: commentText });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};







//comment and rating for application 

const commentAndRating = async (req, res) => {
  try {
    const userId = req.decoded.userId
    const applicationId = req.params.applicationId

    let data = {
      userId: userId,
      applicationId: applicationId
    }

    let ratingData = await rating.findOne(data)
    let commentData = await Comment.find(data)

    let finalData = {
      ratingInfo: ratingData,
      commentInfo: commentData
    }

    return res.status(200).send({ status: true, data: finalData })

  } catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
}

const deleteComment = async (req, res) => {
  try {
    
    const userId = req.decoded.userId;
    const commentId = req.params.commentId;
    console.log(userId, commentId)


    // Remove the comment ID from the user's comment array
    await User.updateOne(
      { _id: userId, 'following_app.comment': commentId },
      { $pull: { 'following_app.$.comment': commentId } }
    );

    // Assuming Comment.delete() is a function that deletes the comment
    await Comment.findOneAndDelete({userId : userId, _id : commentId});

    // Send a success response
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
};



module.exports = { createComment, commentAndRating, deleteComment };

