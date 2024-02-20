const { ObjectId } = require("mongodb");

const replyUserFeedback = async (req, res, feedbackCollection) => {
    try {
        const id = req.params.id;
        const reply = req.body;
        const result = await feedbackCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: reply,
            }
        );
        res.send(result);
    } catch (error) {
        console.log("Error from updating reply", error);
    }
};
module.exports = replyUserFeedback;
