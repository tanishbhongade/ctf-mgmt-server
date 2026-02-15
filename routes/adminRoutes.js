const express = require('express')
const cors = require('cors')
const adminController = require('./../controllers/adminController')

const router = express.Router()

router.get('/leaderboard', cors({
    origin: 'http://localhost:5173'
}), adminController.getLeaderboard)

module.exports = router