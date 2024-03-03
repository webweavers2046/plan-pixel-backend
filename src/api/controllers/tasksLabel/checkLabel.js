const { ObjectId } = require("mongodb");

const checkLabel = async (req, res, tasks) => {

    const taskId = req?.params?.taskId
    const index = req?.body?.index;
    const checked = req?.body?.checked;
      console.log("card id", taskId);
      console.log("is checked", checked);
      console.log("index", index);
    try {

        const filter = {_id: new ObjectId(taskId)};
        const update = { $set: { "labels.$[elem].checked": checked } };
        const options = { arrayFilters: [{ "elem.index": index }] };

        const result = await tasks.updateOne(filter,update,options);
        res.send(result);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};


module.exports = { checkLabel }