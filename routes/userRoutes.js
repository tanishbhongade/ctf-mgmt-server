const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router
    .post('/register', userController.register)
    .post('/login', userController.login)

module.exports = router