const { ObjectId } = require("mongodb");

const getNotifications = async (req, res, workspaces) => {
    const workspaceId = req.params.activeWorkspaceId;

    try {
        const workspace = await workspaces.findOne({
            _id: new ObjectId(workspaceId),
        });
        res.send(workspace?.notifications);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getNotifications };
