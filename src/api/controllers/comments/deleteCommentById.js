const { ObjectId } = require("mongodb");

const deleteCommentById = async(req,res,comments) => {
    const id = req?.params?.id;

    if(!ObjectId.isValid(id)) return res.send("please send valid id")

    const result = await comments.deleteOne({_id:new ObjectId(id)})
    res.send(result)
}

module.exports = deleteCommentById;