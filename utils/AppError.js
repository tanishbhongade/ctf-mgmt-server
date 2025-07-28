const express = require('express')

class AppError extends Error {
    constructor(message, statusCode) {
        super(message || 'internal server error')
        this.statusCode = statusCode || 500
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError