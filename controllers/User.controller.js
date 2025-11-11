const AsyncHandler = require('../middlewares/asynchandler');
const User = require('../models/User.model');
const { GenerateToken } = require('../utils/jwt');

// ✅ Register User
const RegisterUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const newUser = new User({ name, email, password });
  await newUser.save();

  console.log("✅ User Registered:", newUser.email);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    }
  });
});

// ✅ Login User
const LoginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Attempt login for:", email);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.verifyPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = GenerateToken(user._id);

  console.log("✅ Login success:", user.email);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    }
  });
});

const GetDetails = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User found",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address || '',
      phone: user.phone || '',
      profilePicture: user.profilePicture || '',
    }
  });
});


// ✅ Update User Profile
const UpdateProfile = AsyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, address, phone, profilePicture } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Update only if provided
  if (name) user.name = name;
  if (email) user.email = email;
  if (address) user.address = address;
  if (phone) user.phone = phone;
  if (profilePicture) user.profilePicture = profilePicture;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      phone: updatedUser.phone,
      profilePicture: updatedUser.profilePicture,
    }
  });
});



module.exports = { RegisterUser, LoginUser, GetDetails , UpdateProfile};
