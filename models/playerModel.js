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
        default: 0,
        required: [true, 'A player must have SSH port'],
        unique: true
    },
    HostIP: {
        type: String,
        default: '127.0.0.1',
        required: true
    },
    password: {
        type: String,
        default: '',
    },
    username: {
        type: String,
        default: 'myuser',
        required: true
    },
    containerId: {
        type: String,
        default: '',
        unique: true,
    },
    playerPassword: {
        type: String,
    }
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player