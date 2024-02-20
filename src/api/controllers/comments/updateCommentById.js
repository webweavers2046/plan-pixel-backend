const { ObjectId } = require("mongodb");

const updateCommentById = async (req, res, comments) => {
  try {
    const id = req?.params?.id;
    // console.log('id',id);
    // console.log('hitting', req.body);
    const filter = {_id:new ObjectId(id)};
    const updatedComment = req.body;
    const updateOperation = {
      $set: updatedComment,
    };

    const result = await comments.updateOne(filter, updateOperation);
    console.log(result);

    res.send(result);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
  };

  module.exports = updateCommentById;