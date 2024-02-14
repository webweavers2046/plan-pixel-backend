const createCardTask = async(req,res,cardTasks) => {
    const newTask = req?.body;
    // console.log('hitting card new task', newTask);
    const result = await cardTasks.insertOne(newTask);
    res.send(result)
}

module.exports = createCardTask;