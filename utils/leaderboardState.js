let currentLeaderboard = [];

module.exports = {
    setLeaderboard: (data) => { currentLeaderboard = data; },
    getLeaderboard: () => currentLeaderboard
};