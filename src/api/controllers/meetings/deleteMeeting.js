const { ObjectId } = require("mongodb");

const deleteMeeting = async (req, res, meetingCollection) =>{
    const id = req?.params?.id;

    if(!ObjectId.isValid(id)) return res.send("please send valid id")

    const result = await meetingCollection.deleteOne({_id:new ObjectId(id)})
    res.send(result)
}

module.exports ={
    deleteMeeting
}