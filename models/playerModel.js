const mongoose = require('mongoose')
const express = require('express')

const playerSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: [true, 'A player must have an ID'],
        unique: true
    },
    currentLevel: {
        type: Number,
        default: 0,
    },
    sshPort: {
        type: Number,
    },
    hostIP: {
        type: String,
    },
    password: {
        type: String,
    },
    username: {
        type: String,
    },
    containerId: {
        type: String,
        unique: true
    },
    playerPassword: {
        // Password of the user (while registration)
        type: String,
    },
    playerJWT: {
        token: {
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: false
        }
    }
})

playerSchema.index(
    { hostIP: 1, sshPort: 1 },
    { unique: true }
)

const Player = mongoose.model('Player', playerSchema)

module.exports = Player