const mongoose = require("mongoose");
const User = require("../users/user.model");

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const resetColl = async () => {
  try {
    await User.deleteMany();
    console.log("User Collection has been reset");
  } catch (err) {
    console.log(err);
  }
};

mongoose.connect(process.env.MONGODB_URI, connectionOptions).then((conn) => {
  console.log("successfully connected to mongo!");
  resetColl();
});

module.exports = {
  User: User,
};
