
const Comment = require("../models/commentSchema");

const rating = require("../models/rating")
const User = require("../models/userModel")



const createComment = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const applicationId = req.params.applicationId;
    const commentText = req.body.comment;


    if (!applicationId) {
      return res.status(400).send({ data: "applicationId required" });
    }

    if (!commentText) {
      return res.status(404).send({ status: true, data: "User not found" });
    }

    const data = {
      userId: userId,
      applicationId: applicationId,
      ...commentText
    };
    console.log(data)

    if (!data) {
      return res.status(404).send({ status: true, data: "data" });
    }


    // Save the new comment to the database
    const savedComment = await Comment.create(data);

    // Find the user and update the correct nested comments array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: true, data: "User not found" });
    }

    const followingApp = user.following_app.find(app => app.obj_id.toString() === applicationId);

    if (!followingApp) {
      return res.status(404).json({ status: true, data: "Application not found for the user" });
    }
    console.log("hello")
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
    const userId = req.decoded.userId
    const commentId = req.params.commentId
    
    await comment.dee

  } catch (err) {

  }
}


module.exports = { createComment, commentAndRating };

