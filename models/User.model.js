const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true
         
    },
    password: { 
        type: String, 
        required: true 
    },
    
    // Optional Fields (Can be updated later)
    address: { 
        type: String, 
        default: "" 
    },
    phone: { 
        type: String, 
        default: "" 
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    },
    profilePicture: { 
        type: String, 
        default: "" 
    }, // URL for profile image
  },
  { timestamps: true }
);

// Middleware: Hash Password Before Saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Method to Verify Password
UserSchema.methods.verifyPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
