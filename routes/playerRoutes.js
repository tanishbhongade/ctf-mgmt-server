const express = require('express')
const playerController = require('./../controllers/playerController')
const { protect } = require('./../middlewares/protect')

const router = express.Router()

router
    .post('/submitflag', protect, playerController.submitflag)
    .patch('/resetlevel', protect, playerController.resetLevel)

module.exports = router