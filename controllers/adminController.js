const catchAsync = require('../utils/catchAsync')
const { getLeaderboard } = require('../utils/leaderboardState');

const fetchLeaderboard = catchAsync(async (req, res, next) => {
    const data = getLeaderboard();

    res.status(200).json({
        status: 'success',
        data
    });
});

module.exports = {
    getLeaderboard: fetchLeaderboard
}