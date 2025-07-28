const express = require('express');
const Player = require('./../models/playerModel');
const Level = require('./../models/levelModel');
const Scheduler = require('./../models/schedulerModel')
const { getLevelDocument } = require('./levelController')
const { signPayload } = require('./userController')
const axios = require('axios');
const crypto = require('crypto')
const AppError = require('./../utils/AppError')
const catchAsync = require('./../utils/catchAsync')

const submitFlag = catchAsync(async (req, res, next) => {
    const { playerId, flag } = req.body;

    if (!playerId || !flag) {
        return next(new AppError('playerId and flag are required', 400))
    }

    const player = await Player.findOne({ playerId });
    if (!player) {
        return next(new AppError('player with given ID not found', 404))
    }

    const level = await getLevelDocument(player.currentLevel);

    if (flag !== level.flag) {
        return next(new AppError('incorrect flag', 403))
    }

    const newLevel = player.currentLevel + 1;
    const levelObj = await getLevelDocument(newLevel);

    const deletionsignature = signPayload({ containerId: player.containerId })
    await axios.delete(`http://${player.HostIP}:8751/api/container/deleteContainer`, {
        headers: {
            'X-Signature': deletionsignature
        },
        data: {
            containerId: player.containerId
        }
    })

    const creationsignature = signPayload({ imageName: levelObj.imageName })
    const response = await axios.post(
        `http://${player.HostIP}:8751/api/container/createContainer`,
        {
            imageName: levelObj.imageName,
        },
        {
            headers: {
                'X-Signature': creationsignature
            },
        }
    );

    const {
        containerId,
        sshPort,
        username,
        password,
        hostIP,
    } = response.data.data;

    await Player.findOneAndUpdate(
        { playerId },
        {
            $set: {
                currentLevel: newLevel,
                containerId,
                sshPort,
                username,
                password,
                HostIP: hostIP,
            },
        }
    );

    return res.status(200).json({
        status: 'success',
        data: response.data.data,
    });
});

module.exports = {
    submitFlag,
};