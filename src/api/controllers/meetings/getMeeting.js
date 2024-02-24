const getMeeting = async (req, res, meetingCollection) =>{
    try {
        const meetings = await meetingCollection.find().toArray();
        res.send(meetings);
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
}

module.exports = getMeeting;