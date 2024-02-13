const { ObjectId } = require("mongodb");

const getExistingActiveWrokspace = async (req, res,userCollection, workspace) => {

  const {userEmail} = req.params

  try {
    
    // Query the database for active workspaces
    if(userEmail){
      const  activeWorkspace= await userCollection.findOne({ email: userEmail },{projection:{_id:0,activeWorkspace:1}});
      const foundWorkspace = await workspace.findOne({_id:new ObjectId(activeWorkspace?.activeWorkspace)})
      // Respond with the active workspaces
      res.json(foundWorkspace);

    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = getExistingActiveWrokspace;
