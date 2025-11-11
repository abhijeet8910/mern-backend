const express = require("express");
const router = express.Router();
const {
    AdminLogin,
    RegisterAdmin,
    GetAdminProfile,
    GetAllUsers,
    GetAllSellers,
    DeleteUser,
    DeleteSeller,
} = require("../controllers/Admin.controllers");

const { ValidateAdminLogin, ValidateAdminRegister } = require("../middlewares/expressvalidator");
const { VerifyToken, IsAdmin } = require("../utils/jwt");

// @route   GET /api/admin/test
// @desc    Check if admin routes are working
// @access  Public
router.get("/test", (req, res) => res.send("Admin routes are working"));

// @route   POST /api/admin/register
// @desc    Register an admin
// @access  Private (Only Admins can register another Admin)
router.post("/register",   ValidateAdminRegister, RegisterAdmin);

// @route   POST /api/admin/login
// @desc    Login an admin
// @access  Public
router.post("/login", ValidateAdminLogin, AdminLogin);

router.get('/profile', VerifyToken, IsAdmin, GetAdminProfile);

// @route   GET /api/admin/users
// @desc    Get all users (Admin Only)
// @access  Private (Admin Only)
router.get("/users", VerifyToken, IsAdmin, GetAllUsers);

// @route   GET /api/admin/sellers
// @desc    Get all sellers (Admin Only)
// @access  Private (Admin Only)
router.get("/sellers", VerifyToken, IsAdmin, GetAllSellers);

// @route   DELETE /api/admin/user/:id
// @desc    Delete a user by ID (Admin Only)
// @access  Private (Admin Only)
router.delete("/user/:id", VerifyToken, IsAdmin, DeleteUser);

// @route   DELETE /api/admin/seller/:id
// @desc    Delete a seller by ID (Admin Only)
// @access  Private (Admin Only)
router.delete("/seller/:id", VerifyToken, IsAdmin, DeleteSeller);

module.exports = router;
