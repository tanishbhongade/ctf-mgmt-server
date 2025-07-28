const globalErrorHandler = (err, req, res, next) => {
    res.status(500).json({
        status: 'failed',
        data: 'internal server error'
    });
}

module.exports = globalErrorHandler