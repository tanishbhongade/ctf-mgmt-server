const express = require('express')
const playerController = require('./../controllers/playerController')
const { protect } = require('./../middlewares/protect')

const router = express.Router()

router.post('/submitFlag', protect, playerController.submitFlag)

module.exports = router