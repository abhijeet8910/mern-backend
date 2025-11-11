const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const SellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
            ref: 'Product'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to hash the password before saving
SellerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
});

// Method to verify a seller's password
SellerSchema.methods.verifyPassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model('Seller', SellerSchema);
