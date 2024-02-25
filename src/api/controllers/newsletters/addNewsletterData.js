const addNewsletterData = async (req, res, newsletterCollection) => {
    try {
        const newSubscriber = req.body;
        const result = await newsletterCollection.insertOne(newSubscriber);
        res.send(result);
    } catch (error) {

    }
};

module.exports = addNewsletterData;
