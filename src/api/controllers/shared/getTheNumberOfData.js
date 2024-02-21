const getTheNumberOfData = async (req, res, givenCollectionName) => {
    try {
        const numberOfData = await givenCollectionName.estimatedDocumentCount();

        res.send({ numberOfData });
    } catch (error) {
        console.log("Find error to get number of data", error);
    }
};

module.exports = getTheNumberOfData;
