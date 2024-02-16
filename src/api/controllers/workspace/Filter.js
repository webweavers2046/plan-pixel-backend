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
      console.log(tasks);
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  module.exports = FilterTasks;