const mongoose = require("mongoose");
const schema = mongoose.Schema;


const tokenSchema = new schema({
  userId: {
    type: schema.Types.ObjectId,
    required: true,
    ref:"user"
  },
  token: {
    type: String,
    required: true,
  }
});

module.exports=mongoose.model("Token",tokenSchema)