const { ObjectId } = require("mongodb");


// Checking is the requester is the admin 
const isCreator = (userEmail,creator) => {
    return userEmail == creator
}



const deleteMember = async (req, res, workspaceCollection) => {
// workspace the requester and member who will be deleted
  const{ workspaceId, userEmail,memberEmail }= req.params;
  const workspace = await workspaceCollection.findOne({
    _id: new ObjectId(workspaceId),
  });

  // Check if the requester is the creator
  if (!isCreator(userEmail,workspace?.creator)) {
    return res
      .status(403)
      .json({ error: "Only the creator can delete a member" });
  }

// delete member 
await workspaceCollection.updateOne({_id: new ObjectId(workspaceId)},{$pull:{members:memberEmail}})
res.send({message:"Successfully deleted a member"})
};


// Delete a workspae
const deleteWorkspace = async(req,res,workspaceCollection) => {
    try {
        // Get the workspaceId from the request parameters
        const {userEmail,workspaceId} = req.params;
    
        // Get the creator's userId from the workspace
        const workspace = await workspaceCollection.findOne({ _id: new ObjectId(workspaceId) });
    
        // Check if the requester is the creator
        if (!isCreator(userEmail,workspace.creator)) {
          return res.status(403).json({ error: 'Only the creator can delete the workspace' });
        }
    
        // Your logic to delete the workspace from the database
        const deletedWorkspace = await workspaceCollection.deleteOne({ _id:new ObjectId(workspaceId) });

        res.json({ message: 'Workspace deleted successfully', deletedWorkspace });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}



module.exports = {
    deleteMember,
    deleteWorkspace
}

