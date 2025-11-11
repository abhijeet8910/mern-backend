const { body, validationResult } = require("express-validator");

// Validation rules for user registration
const ValidateRegister = [
    body("name").notEmpty().withMessage("Name is required"), // Ensures 'name' is not empty
    body("email").isEmail().withMessage("Invalid email address"), // Ensures 'email' is valid
    body("password").isLength({ min: 6, max: 20 }).withMessage("Password must be at least 6 characters and at most 20"), // Checks password length
    (req, res, next) => {
        const errors = validationResult(req); // Collects validation results
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map((err) => err.msg) });
        }
        next();
    },
];

// Validation rules for user login
const ValidateLogin = [
    body("email").isEmail().withMessage("Invalid email address"), // Ensures 'email' is valid
    body("password").notEmpty().withMessage("Password is required"), // Ensures 'password' is not empty
    (req, res, next) => {
        const errors = validationResult(req); // Collects validation results
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map((err) => err.msg) });
        }
        next();
    },
];

// Validation rules for seller registration
const ValidateSellerRegister = [
    body("name").notEmpty().withMessage("Name is required"), // Ensures 'name' is not empty
    body("email").isEmail().withMessage("Invalid email address"), // Ensures 'email' is valid
    body("password").isLength({ min: 6, max: 20 }).withMessage("Password must be at least 6 characters and at most 20"), // Checks password length
    body("contactNumber")
        .notEmpty().withMessage("Contact number is required") // Ensures 'contactNumber' is not empty
        .isNumeric().withMessage("Contact number must be numeric"), // Checks that contactNumber contains only numbers
    body("address.street").notEmpty().withMessage("Street is required"),
    body("address.city").notEmpty().withMessage("City is required"),
    body("address.state").notEmpty().withMessage("State is required"),
    body("address.zipCode").notEmpty().withMessage("Zip code is required"),
    body("address.country").notEmpty().withMessage("Country is required"),
    (req, res, next) => {
        const errors = validationResult(req); // Collects validation results
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map((err) => err.msg) });
        }
        next();
    },
];

// Validation rules for seller login
const ValidateSellerLogin = [
    body("email").isEmail().withMessage("Invalid email address"), // Ensures 'email' is valid
    body("password").notEmpty().withMessage("Password is required"), // Ensures 'password' is not empty
    (req, res, next) => {
        const errors = validationResult(req); // Collects validation results
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map((err) => err.msg) });
        }
        next();
    },
];

// Validation rules for admin registration
const ValidateAdminRegister = [
    body("email").isEmail().withMessage("Invalid email address"), // Ensures 'email' is valid
    body("password")
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be at least 6 characters and at most 20"), // Checks password length
    (req, res, next) => {
        const errors = validationResult(req); // Collects validation results
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map((err) => err.msg) });
        }
        next();
    },
];

// Validation rules for admin login
const ValidateAdminLogin = [
    body("email").isEmail().withMessage("Invalid email address"), // Ensures 'email' is valid
    body("password").notEmpty().withMessage("Password is required"), // Ensures 'password' is not empty
    (req, res, next) => {
        const errors = validationResult(req); // Collects validation results
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map((err) => err.msg) });
        }
        next();
    },
];

module.exports = {
    ValidateRegister,
    ValidateLogin,
    ValidateSellerRegister,
    ValidateSellerLogin,
    ValidateAdminRegister,
    ValidateAdminLogin,
};
