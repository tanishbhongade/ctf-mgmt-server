const globalErrorHandler = (err, req, res, next) => {
    // console.log("Global error handler triggered:", err.message, "Status:", err.statusCode);  // Debug log (remove in production)

    // If the error has a custom statusCode (e.g., from AppError), use it
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            status: err.status || (err.statusCode >= 400 && err.statusCode < 500 ? 'fail' : 'error'),  // Use err.status if set, else derive
            message: err.message
        });
    }

    // Fallback for unexpected errors (no statusCode)
    // console.error('Unhandled error:', err.stack);  // Log full stack for debugging
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'  // Keep it generic—don't leak details
    });
};

module.exports = globalErrorHandler;