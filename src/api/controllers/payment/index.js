const { ObjectId } = require("mongodb");
const getPaymentInfo = async (req, res, tasksCollection) => {
    try {
        const result = await tasksCollection.find().toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
};
const getLastFivePremiumMembers = async (req, res, paymentInfo) => {
    try {
        const premiumMembers = await paymentInfo
            .find({ paymentStatus: true })
            .sort({ _id: -1 })
            .limit(5)
            .toArray();
        res.json(premiumMembers);
    } catch (error) {
        console.error("Error fetching premium members:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deletePaymentInfo = async (req, res, paymentInfo) => {
    try {
        const id = req.params.id;
        const result = await paymentInfo.deleteOne({
            _id: new ObjectId(id),
        });

        res.send(result);
    } catch (error) {
        console.log("Error when deleting subscriber", error);
    }
};

module.exports = {
    getPaymentInfo,
    deletePaymentInfo,
    getLastFivePremiumMembers,
};
