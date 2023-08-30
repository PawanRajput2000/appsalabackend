
const Comment = require("../models/commentSchema");

const rating = require("../models/rating")
const User = require("../models/userModel")



const createComment = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const applicationId = req.params.applicationId;
    const commentText = req.body.comment;
    

    if (!applicationId) {
      return res.status(400).json({ status:true ,data: "applicationId required" });
    }

    if (!commentText) {
      return res.status(400).json({ status:true ,data: "Comment text required" });
    }

    // Construct the comment data
    const commentData = {
      userId: userId,
      applicationId: applicationId,
      comment: commentText
    };

    // Save the new comment to the database
    const savedComment = await Comment.create(commentData);

    // Find the user and update the correct nested comments array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status:true ,data: "User not found" });
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
    
    // Save the user with updated subscription and comment arrays
    await user.save();
    // Emit a "newComment" event to notify connected clients
    io.emit("newComment", savedComment);


    res.json({ message: "Comment added successfully.", status: followingApp.status });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
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

