// const socketLogics = (app, io) => {
//   io.on("connection",async (socket) => {
//     console.log("A user connected", socket.id);
//     const tasksCollection = await createDB("tasks");
//     socket.on("client-event",async (data) => {
//       console.log("Received data from client:", data);
     
//       const alltasks = await tasksCollection.find().toArray()
//       console.log(alltasks)

//       io.emit("server-event", {
//         message: alltasks,
//       });
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });
// };
// module.exports = socketLogics