const axios = require('axios')
const levelController = require('./levelController')
const Player = require('../models/playerModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Scheduler = require('./../models/schedulerModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')

const ROUNDS = 10
const PORT = Number.parseInt(process.env.PORT)

const getNextWorkerNode = async (next) => {
    const WORKER_HOSTS = global.WORKER_HOSTS
    const WORKER_NODES = global.WORKER_NODES

    if (WORKER_HOSTS.length === 0) {
        throw new AppError('internal server error', 500)
    }

    if (WORKER_HOSTS.length === 1) {
        const host = WORKER_HOSTS[0];
        const port = WORKER_NODES.get(host);
        return `${host}:${port}`;
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

    const nodeIndex = scheduler.currentNodeIndex % WORKER_HOSTS.length;

    const host = WORKER_HOSTS[nodeIndex]
    const port = WORKER_NODES.get(host)

    return `${host}:${port}`
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

const login = catchAsync(async (req, res, next) => {
    const { playerId, playerPassword } = req.body

    if (!playerId || !playerPassword) {
        return next(new AppError('player ID and password are required to log in', 400))
    }

    const player = await Player.findOne({ playerId })
    if (!player || !(await bcrypt.compare(playerPassword, player.playerPassword))) {
        return next(new AppError('invalid credentials', 401))
    }

    const jwtToken = signToken(playerId)
    player.playerJWT = { token: jwtToken, isActive: true }
    await player.save()

    res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: 60 * 60 * 1000 })
    res.status(200).json({
        status: 'success',
        data: { playerId }
    })
})

const register = catchAsync(async (req, res, next) => {
    const levelObj = await levelController.getLevelDocument(0)
    const playerId = req.body.playerId
    const playerPassword = req.body.playerPassword

    // PlayerID and player password are required to sign up
    if (!playerId || !playerPassword) {
        return next(new AppError('playerId and password are required to sign up', 400))
    }

    const signature = signPayload({
        imageName: levelObj.imageName
    })
    const workerNode = await getNextWorkerNode()

    // Create initial container on worker node
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
    const jwtToken = signToken(playerId)
    await Player.create({
        containerId,
        sshPort,
        username,
        password,
        hostIP: hostIP,
        playerId,
        playerPassword: hashedPassword,
        playerJWT: {
            token: jwtToken,
            isActive: true
        }
    })

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
    })
})

const signOut = catchAsync(async (req, res, next) => {
    const player = await Player.findOneAndUpdate({
        playerId: req.body.playerId
    }, {
        $set: {
            'playerJWT.isActive': false
        }
    })

    res.clearCookie('jwt')
    res.status(200).json({
        status: 'success',
        message: 'Signed out successfully!'
    })
})

module.exports = {
    register,
    login,
    signPayload,
    signOut,
    createSendToken
}