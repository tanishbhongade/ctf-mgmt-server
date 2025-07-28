const axios = require('axios')
const levelController = require('./levelController')
const Player = require('../models/playerModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Scheduler = require('./../models/schedulerModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')
const getConfigurationData = require('./../utils/configPuller')

const ROUNDS = 10
const PORT = Number.parseInt(process.env.PORT)

let WORKER_NODES = getConfigurationData()


const getNextWorkerNode = async (next) => {
    if (WORKER_NODES.length === 0) {
        throw new AppError('internal server error', 500)
    }

    if (WORKER_NODES.length === 1) {
        return WORKER_NODES[0];
    }

    const scheduler = await Scheduler.findOneAndUpdate(
        { name: 'roundRobinScheduler' },
        { $inc: { currentNodeIndex: 1 } },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: { currentNodeIndex: 0 },
        }
    );

    const nodeIndex = scheduler.currentNodeIndex % WORKER_NODES.length;
    return WORKER_NODES[nodeIndex];
};

const signPayload = (data) => {
    const payloadString = JSON.stringify(data)
    return crypto.createHmac('sha256', process.env.HMAC_SECRET).update(payloadString).digest('hex')
}

const signToken = (playerId) => {
    return jwt.sign({ playerId }, process.env.JWT_SECRET, {
        expiresIn: '2h'
    })
}

const createSendToken = async (playerId, res) => {
    const token = signToken(playerId)
    const cookieOptions = {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    }

    res.cookie('jwt', token, cookieOptions)

    res.status(200).json({
        status: 'success',
        data: {
            playerId
        }
    })
}

const hashPassword = async (plainTextPassword) => {
    return await bcrypt.hash(plainTextPassword, ROUNDS)
}

const login = catchAsync(async (req, res) => {
    const { playerId, playerPassword } = req.body

    if (!playerId || !playerPassword) {
        return next(new AppError('player ID and password are required to log in', 400))
    }

    const player = await Player.findOne({ playerId })
    if (!player || !(await bcrypt.compare(playerPassword, player.playerPassword))) {
        return next(new AppError('invalid credentials', 401))
    }

    createSendToken(playerId, res)
})

const register = catchAsync(async (req, res, next) => {
    const levelObj = await levelController.getLevelDocument(0)
    const playerId = req.body.playerId
    const playerPassword = req.body.playerPassword

    if (!playerId || !playerPassword) {
        return next(new AppError('playerId and password are required to sign up', 400))
    }

    const signature = signPayload({
        imageName: levelObj.imageName
    })
    const workerNode = await getNextWorkerNode()

    const response = await axios.post(
        `http://${workerNode}/api/container/createContainer`,
        {
            imageName: levelObj.imageName,
        },
        {
            headers: {
                'X-Signature': signature
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

    const hashedPassword = await hashPassword(playerPassword)
    await Player.create({
        containerId,
        sshPort,
        username,
        password,
        HostIP: hostIP,
        playerId,
        playerPassword: hashedPassword
    })

    const jwtToken = signToken(playerId)
    res.cookie('jwt', jwtToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    })
    res.status(201).json({
        containerId,
        sshPort,
        username,
        password,
        hostIP,
        playerId,
        playerPassword: hashedPassword
    })
})

module.exports = {
    register,
    login,
    signPayload
}