const mongoose = require("mongoose");
module.exports = connnection = async () => {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log("✅DB Connection Succesfull..!");
  } catch (error) {
    console.log("❌DB Connection Failed..!");
    console.log(error);
  }
};
