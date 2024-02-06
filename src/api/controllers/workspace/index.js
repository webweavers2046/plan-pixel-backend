const createWorkspace = async (req, res,workspace) => {
  const newWrokspace = req.body;

  console.log(newWrokspace)
  try {
    const insertedTask = await workspace.insertOne(newWrokspace);
    res.send(insertedTask);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = createWorkspace;
