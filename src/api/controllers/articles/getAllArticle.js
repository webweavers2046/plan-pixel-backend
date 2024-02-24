const getAllArticle = async (req, res, articleCollection) => {
    try {
        const allArticle = await articleCollection.find().toArray();
        res.send(allArticle);
    } catch (error) {
        console.log("Error to get Articles ", error);
    }
};
module.exports = getAllArticle;
