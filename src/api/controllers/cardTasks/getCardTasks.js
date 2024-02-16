const getCardTasks = async(req,res,cardTasks) => {
    const cardId = req?.params?.cardId;
    // console.log('hitting card tasks', cardId);
    const result = await cardTasks.find({cardId : cardId}).toArray();
    res.send(result)
}

module.exports = getCardTasks;