// This file is about creating task in the database

const createComment = async (req, res, comments) => {
  const newComment = req.body;
//   console.log(newComment);
  try {
    const insertedComment = await comments.insertOne(newComment);
    res.send(insertedComment);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = createComment;
