const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error('Error:', error);
        // You can customize the response here if needed
        res.status(500).json({ message: 'Internal server error', error: error.message });
        next(error); // Pass the error to the next middleware
    });
};

module.exports = asyncHandler;