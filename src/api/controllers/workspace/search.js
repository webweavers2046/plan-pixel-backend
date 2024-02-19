const searchMembers = async (req, res, userCollection) => {
  const { query } = req.query;

  try {
      const regexQuery = {
        $or: [
          { email: { $regex: query, $options: "i" } },
          { name: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
          { skills: { $regex: query, $options: "i" } },
        ],
      };
      const matchingMembers = await userCollection.find(regexQuery).toArray();
      res.send(matchingMembers);
    
  } catch (error) {
    console.log(error)
  }
};

const SearchTasks = async (req, res, tasksCollection, usersCollection) => {
  const { query, userEmail } = req.query;

  try {
    // Check if user email is provided, return error if not
    if (!userEmail) return res.status(400).json({ error: "Please provide user email" });

    // Retrieve the user and get all workspaces
    const user = await usersCollection.findOne({ email: userEmail });
    const userWorkspaces = user.workspaces || [];
    // Convert ObjectId instances to strings
    const workspaceIdsAsString = userWorkspaces.map((id) => id.toString());

    // Constructing the regex query based on title, description, and additional criteria
    const regexQuery = {
      $and: [
        { workspace: { $in: workspaceIdsAsString } }, // Add the workspace filter
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { creator: { $regex: query, $options: "i" } },
            // Add more criteria here using $regex if needed
          ],
        },
      ],
    };

    const matchingTasks = await tasksCollection.find(regexQuery).toArray();


    res.send(matchingTasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const saveUserSearchHistory = async(req,res,searchHistoryCollection) => {

  try {
    const history = req.body
    await searchHistoryCollection.insertOne(history)
    
  } catch (error) {
    console.log(error)
  }
  
}

const getUserSearchHistory = async(req,res,searchHistoryCollection) => {
  try {
    const {userEmail} = req.params
    const userHistory = await searchHistoryCollection.find({userEmail}).sort({sortByDate:-1}).toArray()
  if(userHistory){
    res.send(userHistory)
  }
  } catch (error) {
    console.log(error)
  }
}

const deleteAllSearchHistory = async(req,res,searchHistoryCollection) => {
  try {
    const deltedHistory = await searchHistoryCollection.deleteMany()
    if(deltedHistory){
      res.send(deltedHistory)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  searchMembers,
  SearchTasks,
  saveUserSearchHistory,
  getUserSearchHistory,
  deleteAllSearchHistory
};
