const { ObjectId } = require("mongodb");

const deleteNewsletterSubscriber = async (req, res, newsletterCollection) => {
    try {
        const id = req.params.id;
        const result = await newsletterCollection.deleteOne({
            _id: new ObjectId(id),
        });
        console.log(result);
        res.send(result);
    } catch (error) {
        console.log("Error when deleting subscriber", error);
    }
};

module.exports = deleteNewsletterSubscriber;
