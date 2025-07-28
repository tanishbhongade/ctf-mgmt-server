const mongoose = require('mongoose')

const levelSchema = new mongoose.Schema({
    level: {
        type: Number,
        required: true,
        unique: true
    },
    flag: {
        type: String,
        required: true,
        unique: true
    },
    imageName: {
        type: String,
        required: true,
    }
})

const Level = mongoose.model('Level', levelSchema)

module.exports = Level