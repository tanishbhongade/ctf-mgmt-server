const mongoose = require('mongoose');

const schedulerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    currentNodeIndex: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('Scheduler', schedulerSchema);