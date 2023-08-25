const rating = require("../models/rating");
const User = require("../models/userModel")

const createRating = async (req, res) => {
    try {
        const userId = req.decoded.userId;
        const applicationId = req.params.applicationId;
        const ratingValue = req.body.rating; // Renamed to avoid variable name conflict

        const data = {
            userId: userId,
            applicationId: applicationId,
            rating: ratingValue // Use the renamed variable here
        };


        // Find the user and update the correct nested comments array
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

        // Attempt to find an existing rating for the given user and application
        let findInDb = await rating.findOneAndUpdate(
            { userId: userId, applicationId: applicationId },// filter
            { $set: data }, // Use $set to update the data
            { new: true, upsert: true } // Options: return updated document and create if not found
        );

        if (findInDb) {
            return res.status(200).send({ status: true, data: "Data Updated" });
        }

        // If no existing rating was found, create a new one
        let saveData = await rating.create(data);
        return res.status(200).send({ status: true, data: saveData });
    } catch (err) {
        return res.status(500).send({ status: false, data: err.message });
    }
};

module.exports = { createRating };
