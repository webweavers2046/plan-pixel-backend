// const app = express();
// const createMongoClient = require("../../../db/CreateMongoClient");
// const client = createMongoClient();
//         const messageCollection = client
//           .db("planPixelDB")
//           .collection("messages");





const messageSocketFunc = (socketIO) => {
  let users = [];
console.log("user form lien 9",users);
  socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("message", async (data) => {

      socketIO.emit("messageResponse", data);
console.log('line 20', data);
    
    });
    socket.on("typing", (data) =>
      socket.broadcast.emit("typingResponse", data)
    );

    //Listens when a new user joins the server
socket.on("newUser", (data) => {
  // Check if the user already exists in the users array
  const existingUser = users.find((user) => user.userName === data.userName);

  if (existingUser) {
    // If the user already exists, update their socketID
    existingUser.socketID = data.socketID;
  } else {
    // If the user doesn't exist, add them to the users array
    users.push(data);
  }
  console.log("line 39" ,data);

  // Sends the updated list of users to the client
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
    const result = await messageCollection.find().toArray();
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
    const newMessage = req.body;
    // const { userEmail } = req.query;
    // const user = await usersCollection.findOne(
    //   { email: userEmail },
    //   { projection: { _id: 0, activeWorkspace: 1 } }
    // );

    // const activeWorkspaceId = user?.activeWorkspace.toString();
    // const newMessage = {
    //   activeWorkspaceId,
    //   ...message,
    // };
    const response = await messageCollection.insertOne(newMessage);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { messageSocketFunc, saveMessageFunc, getSaveMessagesFunc };
