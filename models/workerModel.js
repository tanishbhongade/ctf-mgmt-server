const mongoose = require('mongoose')
const crypto = require('crypto')

const workerSchema = new mongoose.Schema({
    workerId: {
        type: String,
        required: true,
        unique: true,
        default: () => {
            crypto.randomUUID()
        }
    },
    ipAddress: {
        type: String,
        required: true,
        unique: true
    },
    port: {
        type: Number,
        required: true,
        default: 8751
    },
    resources: {
        cpuCores: {
            type: Number,
            required: true
        },
        memoryBytes: {
            type: Number,
            required: true
        },
        diskBytes: {
            type: Number,
            required: true
        }
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Worker', workerSchema)