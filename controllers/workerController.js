const axios = require('axios')
const Worker = require('./../models/workerModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')

const registerWorker = catchAsync(async (req, res, next) => {
    const {
        ipAddress,
        port,
        resources
    } = req.body

    if (!ipAddress || !resources) {
        return next(new AppError('workerId, ipAddress, port and resources info needed.', 400));
    }

    const existingWorker = await Worker.findOne({ workerId })
    if (existingWorker) {
        return next(new AppError('worker already exists', 409));
    }

    const worker = await Worker.create({
        ipAddress,
        port,
        resources
    })

    return res.status(200).json({
        status: 'success',
        workerId: worker.workerId
    })
})

module.exports = {
    registerWorker
}