const getAllNewsletterSubscribers = async (req, res, newsletterCollection) => {
    // get all newsletter
    try {
        const newsletters = await newsletterCollection.find().toArray();
        res.send(newsletters);
    } catch (error) {
        console.log("Error to get newsletter data", error);
    }
};

module.exports = getAllNewsletterSubscribers;
