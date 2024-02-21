const addArticle = async (req, res, articleCollection) => {
    try {
        const newArticle = req.body;
        const result = await articleCollection.insertOne(newArticle);
        res.send(result);
    } catch (error) {
        console.log("error to add new article in database", error);
    }
};

module.exports = addArticle;
