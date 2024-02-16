const searchMembers = async (req, res, userCollection) => {
  const { query } = req.query;

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
};

module.exports = searchMembers;
