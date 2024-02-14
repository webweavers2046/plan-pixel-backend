const { ObjectId } = require("mongodb")

const deleteCardTask = async(req,res,cardTasks) => {
    const id = req?.params?.id
    // console.log('hitting delete', id);
    if(!ObjectId.isValid(id)) return res.send("please send valid id")

    const result = await cardTasks.deleteOne({_id:new ObjectId(id)})
    res.send(result)
}

module.exports = deleteCardTask;