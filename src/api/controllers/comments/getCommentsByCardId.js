// This file is about creating task in the database

const getCommentsByCardId = async (req, res, comments) => {
    const cardId = req?.params?.cardId;
    // console.log('hitting comments', cardId);
    const result = await comments.find({cardId : cardId}).toArray();
    res.send(result)
  };
  
  module.exports = getCommentsByCardId;
  