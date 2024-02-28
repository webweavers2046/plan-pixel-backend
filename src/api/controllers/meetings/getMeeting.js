const { ObjectId } = require("mongodb");

const getAllMeeting = async (req, res, meetingCollection) => {
  try {
    const meetings = await meetingCollection.find().toArray();
    res.send(meetings);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getMeeting = async (req, res, meetingCollection) => {
  const id = req?.params.workspaceId;
  const query = { "newMeeting.activeWorkspace._id": id };
 
  try {
    const meetings = await meetingCollection.find(query).toArray();
    res.send(meetings);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getMeeting,
  getAllMeeting,
};
