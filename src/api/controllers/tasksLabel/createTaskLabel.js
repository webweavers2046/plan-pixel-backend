const { ObjectId } = require("mongodb");

const createTaskLabel = async (req, res, tasks) => {

  const taskId = req?.params?.taskId
  const newLabel = req?.body;
  // console.log("card id", taskId);
  // console.log("label", newLabel);
  try {

    // checking if label exist with same index
    const isSameIndexExist = await tasks.findOne({
      _id: new ObjectId(taskId),
      "labels.index": { $in: [newLabel?.index] }
    });
    // console.log("same index", isSameIndexExist);

    if (isSameIndexExist) {
      const deleteLabel = await tasks.updateOne(
        { _id: new ObjectId(taskId) },
        { $pull: { labels: { index: newLabel?.index } } }
      );
      // console.log("delete Label", deleteLabel);
    }

    // 

    const result = await tasks.updateOne(
      { _id: new ObjectId(taskId) },
      { $addToSet: { labels: newLabel } }
    );
    res.send(result);

  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};


module.exports = { createTaskLabel }