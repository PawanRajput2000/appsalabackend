const rating = require("../models/rating");

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
