const getAllUserFeedback = async (req, res, feedbackCollection) => {
    try {
        const feedbacks = await feedbackCollection.find().toArray();
        console.log(feedbacks);
        res.send(feedbacks);
    } catch (error) {
        console.log("Find error to get users feedback", error);
    }
};

module.exports = getAllUserFeedback;
