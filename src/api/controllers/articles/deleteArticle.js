
const { ObjectId } = require("mongodb");

const deleteArticle = async (req, res, articleCollection) => {
    try {
        const id = req.params.id;
        const result = await articleCollection.deleteOne({
            _id: new ObjectId(id),
        });

        res.send(result);
    } catch (error) {
        console.log("Error when deleting subscriber", error);
    }
};

module.exports = deleteArticle;
