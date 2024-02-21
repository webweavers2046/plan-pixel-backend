const { ObjectId } = require("mongodb");

const deleteTask = async(req,res,taskCollection) => {
    const id = req?.params?.id;

    if(!ObjectId.isValid(id)) return res.send("please send valid id")

    const result = await taskCollection.deleteOne({_id:new ObjectId(id)})
    res.send(result)
}


module.exports = deleteTask;