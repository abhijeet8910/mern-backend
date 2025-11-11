const AsyncHandler = require("../middlewares/asynchandler");
const Admin = require("../models/Admin.model");
const User = require("../models/User.model");
const Seller = require("../models/Seller.model");
const { GenerateToken } = require("../utils/jwt");

// @desc    Register an Admin (For initial setup, should be restricted later)
// @route   POST /api/admin/register
// @access  Public
const RegisterAdmin = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    // Create new admin (password will be hashed in pre-save middleware)
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    res.status(201).json({ success: true, message: "Admin registered successfully" });
});

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const AdminLogin = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.verifyPassword(password))) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate token
    const token = GenerateToken(admin._id);

    res.json({ success: true, message: "Login successful", token });
});

// @desc    Get Admin Profile
// @route   GET /api/admin/profile
// @access  Private (Admin Only)
const GetAdminProfile = AsyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.json({ success: true, admin });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const GetAllUsers = AsyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
});

// @desc    Get all sellers
// @route   GET /api/admin/sellers
// @access  Private (Admin Only)
const GetAllSellers = AsyncHandler(async (req, res) => {
    const sellers = await Seller.find().select("-password");
    res.json({ success: true, sellers });
});

// @desc    Delete a user
// @route   DELETE /api/admin/user/:id
// @access  Private (Admin Only)
const DeleteUser = AsyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
});

// @desc    Delete a seller
// @route   DELETE /api/admin/seller/:id
// @access  Private (Admin Only)
const DeleteSeller = AsyncHandler(async (req, res) => {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) {
        return res.status(404).json({ success: false, message: "Seller not found" });
    }
    res.json({ success: true, message: "Seller deleted successfully" });
});

module.exports = {
    RegisterAdmin,
    AdminLogin,
    GetAdminProfile,
    GetAllUsers,
    GetAllSellers,
    DeleteUser,
    DeleteSeller,
};
