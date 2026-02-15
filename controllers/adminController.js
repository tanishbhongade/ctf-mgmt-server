const catchAsync = require('../utils/catchAsync')
const Submission = require('./../models/submissionModel')

const getLeaderboard = catchAsync(async (req, res, next) => {
    const leaderboard = await Submission.getLeaderboard()
    res.status(200).json({
        status: 'success',
        data: leaderboard
    })
})

module.exports = {
    getLeaderboard
}