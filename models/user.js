const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true },
  accountNumber: {type: String},
  contact: {type: String},
  billingAddress: {type: String},
  plan: {type: String},
  status: {type: Boolean},
  photo: {type: String}
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
