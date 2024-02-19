const getPaymentInfo =async(req,res,tasksCollection)=>{
    try {
        const result = await tasksCollection.find().toArray()
        res.send(result)
    } catch (error) {
        console.log(error);
        
    }
}


module.exports={getPaymentInfo}