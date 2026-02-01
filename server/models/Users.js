const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"please add"],
  },
  email: {
    type: String,
    unique:true,
    required: [true,"please add email"],
  },
  password: {
    type: String,
    required: [true,"please add password"],
  },
  role: {
    type: String,
    required: [true,"please add role"],
  },
}, { timestamps: true });
module.exports=mongoose.model("User",userSchema);