const addUserFeedback = async (req, res, feedbackCollection) => {
    try {
        const newFeedback = req.body;
        const result = await feedbackCollection.insertOne(newFeedback);
        res.send(result);
    } catch (error) {
        console.log("error to add new feedback in database", error);
    }
};

module.exports = addUserFeedback;
