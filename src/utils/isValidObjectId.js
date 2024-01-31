// const { ObjectId } = require('mongodb');

// const isValidObjectId = (res, id) => {
//   // Making sure sent id is valid
//   try {
//     if (!ObjectId.isValid(id)) {
//       console.log("invalid", id);
//       return res.status(400).json({ message: "Invalid taskId format" });
//     }
//   } catch (error) {
//     console.error(error.message);
//   }

//   return true; // Return true to indicate a valid ID
// };

// module.exports = isValidObjectId;
