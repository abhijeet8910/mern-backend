const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash Password Before Saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Method to Verify Password
AdminSchema.methods.verifyPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
