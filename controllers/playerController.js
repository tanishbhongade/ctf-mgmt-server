const axios = require('axios');
const Player = require('./../models/playerModel');
const AppError = require('./../utils/AppError')
const catchAsync = require('./../utils/catchAsync')
const { getLevelDocument } = require('./levelController')
const { signPayload } = require('./userController')
const Submission = require('./../models/submissionModel')

const resetLevel = catchAsync(async (req, res, next) => {
    let WORKER_NODES = global.WORKER_NODES
    const player = await Player.findOne({ playerId: req.body.playerId })
    if (!player) {
        return next(new AppError('player not found', 404))
    }
    const containerId = player.containerId
    const resetsignature = signPayload({ containerId: player.containerId })
    await axios.patch(
        `http://${player.hostIP}:${WORKER_NODES.get(player.hostIP)}/api/container/restartContainer`, {
        containerId
    }, {
        headers: {
            'X-Signature': resetsignature
        }
    })

    res.status(200).json({
        status: 'success',
        data: 'level successfully resetted'
    })
})

const submitflag = catchAsync(async (req, res, next) => {
    const timestamp = Date.now()
    const { playerId, flag } = req.body;

    // Player ID and flags are needed for submission
    if (!playerId || !flag) {
        return next(new AppError('playerId and flag are required', 400))
    }

    // Check if player exists
    const player = await Player.findOne({ playerId });
    if (!player) {
        return next(new AppError('player with given ID not found', 404))
    }

    // Check submitted flag with actual flag
    const level = await getLevelDocument(player.currentLevel);

    if (flag !== level.flag) {
        return next(new AppError('incorrect flag', 403))
    }

    await Submission.create({
        timestamp: timestamp,
        playerId: player._id,
        level: player.currentLevel
    })

    const newLevel = player.currentLevel + 1;

    // Update the new details in the player database
    await Player.findOneAndUpdate(
        { playerId },
        {
            $set: {
                currentLevel: newLevel,
            },
        }
    );

    // Send successful response to player
    return res.status(200).json({
        status: 'success',
    });
});

module.exports = {
    submitflag,
    resetLevel
};