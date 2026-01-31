const jwt = require('jsonwebtoken')
const Player = require('./../models/playerModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')

const protect = catchAsync(async (req, res, next) => {
    const token = req.cookies?.jwt

    if (!token) {
        return next(new AppError("no token presented", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!req.body) req.body = {};
    req.body.playerId = decoded.playerId

    const player = await Player.findOne({ playerId: req.body.playerId })

    if (!player) {
        return next(new AppError("player with given ID not found", 401))
    }

    if (!player.playerJWT.isActive) {
        return next(new AppError("expired token", 401))
    }

    next()
})

module.exports = { protect }