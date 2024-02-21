const { ObjectId } = require("mongodb");

const createNotifications = async (req, res, workspaces) => {

    const workspaceId = req.params.activeWorkspaceId
    const notification = req.body

    try {
      const workspace = await workspaces.findOne({ _id: new ObjectId(workspaceId) });
      const filter = { _id: new ObjectId(workspaceId) }
      const notifications = workspace?.notifications
      const newNotifications = notifications.unshift(notification)
      const update = {
        $set: newNotifications,
      };
      const result = await taskCollection.updateOne(filter, update);
      res.send(result);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  };


 module.exports = {createNotifications}