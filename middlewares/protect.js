const jwt = require('jsonwebtoken')
const Player = require('./../models/playerModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')

const protect = catchAsync(async (req, res, next) => {
    const token = req.cookies?.jwt

    if (!token) {
        return next(new AppError("No token presented", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.body.playerId = decoded.playerId

    const player = await Player.findOne({ playerId: req.body.playerId })

    if (!player) {
        return next(new AppError("Player with given ID not found", 401))
    }

    if (!player.playerJWT.isActive) {
        return next(new AppError("Expired token", 401))
    }

    next()
})

module.exports = { protect }