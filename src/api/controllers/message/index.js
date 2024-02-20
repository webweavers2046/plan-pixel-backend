let message = {
  text: "",
  name: "",
};

const messageSocketFunc = (socketIO) => {
  let users = [];

  socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("message", (data) => {
      socketIO.emit("messageResponse", data);
      message.text = data.text;
      message.name = data.name;
    });
    socket.on("typing", (data) =>
      socket.broadcast.emit("typingResponse", data)
    );

    //Listens when a new user joins the server
    socket.on("newUser", (data) => {
      //Adds the new user to the list of users
      users.push(data);
      // console.log(users);
      //Sends the list of users to the client
      socketIO.emit("newUserResponse", users);
    });

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
      //Updates the list of users when a user disconnects from the server
      users = users.filter((user) => user.socketID !== socket.id);
      // console.log(users);
      //Sends the list of users to the client
      socketIO.emit("newUserResponse", users);
      socket.disconnect();
    });
  });
};
const getSaveMessagesFunc = async (req, res, messageCollection) => {
  try {
    const result =await messageCollection.find().toArray()
    res.send(result);
  } catch (error) {}
};
const saveMessageFunc = async (
  req,
  res,
  messageCollection,
  usersCollection
) => {
  try {
    const { userEmail } = req.query;
    const user = await usersCollection.findOne(
      { email: userEmail },
      { projection: { _id: 0, activeWorkspace: 1 } }
    );

    const activeWorkspaceId = user?.activeWorkspace.toString();
    const newMessage = {
      ...message,
      activeWorkspaceId,
    };
    const response = await messageCollection.insertOne(message);
    res.send(response);
    // const res = messageCollection.insertOne()
  } catch (error) {}
};
module.exports = { messageSocketFunc, saveMessageFunc, getSaveMessagesFunc };
