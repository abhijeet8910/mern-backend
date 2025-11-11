const AsyncHandler = require("../middlewares/asynchandler");
const Seller = require("../models/Seller.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const { GenerateToken } = require("../utils/jwt");

// Function to register a new seller
const RegisterSeller = AsyncHandler(async (req, res) => {
    const { name, email, password, contactNumber, address } = req.body;

    // Check if the seller already exists
    const isEmail = await Seller.findOne({ email });

    if (isEmail) {
        return res.status(400).json({ success: false, message: "Seller already exists" });
    } 
    //Adds a new seller
    const seller = new Seller({ name, email, password, contactNumber, address });
    await seller.save();
    
    console.log("Seller Registered Successfully");
    res.status(201).json({ success: true, message: "Seller Registered successfully", seller });
});

// Function to login the seller
const LoginSeller = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Finding the seller with the given email
    const isEmail = await Seller.findOne({ email });

    // If the seller is not found or the password is incorrect
    if (!isEmail || !(await isEmail.verifyPassword(password))) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generating a JSON web token using the seller's id
    const token = GenerateToken(isEmail._id);

    // Returning a 200 OK response with the token
    res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        seller: isEmail.name,
        id: isEmail._id,
        email: isEmail.email
    });
});
// ✅ Get Seller Details using token
const GetSellerDetails = AsyncHandler(async (req, res) => {
    const seller = await Seller.findById(req.user._id);

    if (!seller) {
        return res.status(404).json({ success: false, message: "Seller not found" });
    }

    res.status(200).json({ success: true, seller });
});

// Get All Orders for a Seller
const GetSellerOrders = AsyncHandler(async (req, res) => {
    const sellerId = req.user._id; // Seller must be logged in

    // Find all products belonging to this seller
    const sellerProducts = await Product.find({ seller: sellerId }).select("_id");

    // Extract product IDs
    const sellerProductIds = sellerProducts.map((p) => p._id);

    // Find orders containing the seller's products
    const orders = await Order.find({ "items.product": { $in: sellerProductIds } })
        .populate("items.product", "name price")
        .populate("user", "name email");

    res.status(200).json({ success: true, message: "Seller orders retrieved", orders });
});

// // Update Order Status (Processing → Shipped → Delivered)
// const UpdateOrderStatus = AsyncHandler(async (req, res) => {
//     const { orderId } = req.params;
//     const { status } = req.body; // Expected: "Processing", "Shipped", "Delivered"

//     // Allowed status updates
//     const validStatus = ["Processing", "Shipped", "Delivered"];
//     if (!validStatus.includes(status)) {
//         return res.status(400).json({ success: false, message: "Invalid status update" });
//     }

//     const order = await Order.findById(orderId);

//     if (!order) {
//         return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Update status
//     order.status = status;
//     await order.save();

//     res.status(200).json({ success: true, message: `Order updated to ${status}`, order });
// });
// ✅ Automatically update to next order status
const UpdateOrderStatus = AsyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    const nextStatus = {
        "Processing": "Shipped",
        "Shipped": "Delivered",
        "Delivered": "Delivered"
    };

    const currentStatus = order.status;
    order.status = nextStatus[currentStatus] || "Processing";
    await order.save();

    res.status(200).json({ success: true, message: `Order status updated to ${order.status}`, order });
});


module.exports = {
    RegisterSeller,
    LoginSeller,
    GetSellerDetails,
    GetSellerOrders,
    UpdateOrderStatus,
};
