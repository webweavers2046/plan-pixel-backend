const getWorkspaceTask = async (req, res, tasks) => {
  const {workspace,creator} = req.params;
  console.log(workspace,creator);
//   console.log(tasks);
  const alltasks = await tasks.find({workspace:workspace,creator:creator}).toArray();
  res.send(alltasks);
};

module.exports = getWorkspaceTask;
