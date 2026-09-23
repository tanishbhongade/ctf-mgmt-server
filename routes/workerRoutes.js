const express = require('express')
const protectWorkerRegistration = require('./../middlewares/protectWorkerRegistration')
const workerController = require('./../controllers/workerController')

const router = express.Router()

router.post('/registerWorker', protectWorkerRegistration, workerController.registerWorker)

module.exports = router