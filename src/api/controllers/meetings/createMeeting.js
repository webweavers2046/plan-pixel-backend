const { ObjectId } = require("mongodb");

const createMeeting = async (req, res, meetingCollection) => {
  const newMeeting = req.body;
  console.log(newMeeting);
  try {
    const meeting = await meetingCollection.insertOne({
        newMeeting
    })
    res.send(meeting)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createMeeting,
};
