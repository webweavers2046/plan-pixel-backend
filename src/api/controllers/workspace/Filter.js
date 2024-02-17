const { ObjectId } = require("mongodb");

const FilterTasks = async (req, res, tasksCollection) => {
    try {
      const { status, priority, workspace, dueDate } = req.body;
  
      // Constructing the filter object based on the provided criteria
      const filter = {};
  
      if (status) {
        filter.status = { $regex: new RegExp(status, 'i') };
      }
  
      if (priority) {
        filter.priority = { $regex: new RegExp(priority, 'i') };
      }
  
      if (workspace) {
        filter.workspace = { $regex: new RegExp(workspace, 'i') };
      }
  
      if (dueDate) {
        filter["dates.dueDate"] = { $regex: new RegExp(dueDate, 'i') };
      }
  
      const tasks = await tasksCollection.find(filter).toArray();
      
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

const SetActiveWorkspaceFromFilter = async(req,res, usersCollection)=> {

  const {workspaceId,userEmail} = req?.body

  console.log("----------", workspaceId,userEmail)
    // if no user email provided
    if (!userEmail) return res.send({ error: "please provide user email" });
    
    if(!ObjectId.isValid(workspaceId)) return res.send({ error: "please provide valid workspace id" });


    const user = await usersCollection.findOne({ email: userEmail });
    // When user switch to different workspace change active workspace id
    const updatedUserActiveWorkspace = await usersCollection.updateOne({email:userEmail},{$set:{activeWorkspace:workspaceId}})

    res.send(updatedUserActiveWorkspace)

}
  
  module.exports = {
    FilterTasks,
    SetActiveWorkspaceFromFilter
  }