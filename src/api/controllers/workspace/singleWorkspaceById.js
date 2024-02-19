const { ObjectId } = require("mongodb");

const singleWorkspaceById = async(req,res,workspaces) => {
    const id = req?.params?.id;
    // console.log('single workspace',id);

    if(!ObjectId.isValid(id)) return res.send("please send valid id")

    const result = await workspaces.findOne({_id:new ObjectId(id)})
    res.send(result)
}

module.exports = singleWorkspaceById;