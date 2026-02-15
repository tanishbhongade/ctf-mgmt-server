const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')
const playerRoutes = require('./routes/playerRoutes')
const adminRoutes = require('./routes/adminRoutes')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const globalErrorHandler = require('./utils/globalErrorHandler')

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api/player', playerRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use(globalErrorHandler)

module.exports = app