const getAllUserFeedback = async (req, res, feedbackCollection) => {
    try {
        const feedbacks = await feedbackCollection.find().toArray();
        const numberOfFeedbacks =
            await feedbackCollection.estimatedDocumentCount();

        res.send({ feedbacks, numberOfFeedbacks });
    } catch (error) {
        console.log("Find error to get users feedback", error);
    }
};

module.exports = getAllUserFeedback;
