const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: [true, 'a submission must have timestamp associated with it.'],
        default: Date.now
    },
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    level: {
        type: Number
    }
})

submissionSchema.index({ playerId: 1, timestamp: -1 })

submissionSchema.statics.getLeaderboard = async function () {
    const results = await this.aggregate([
        // Sort newest first
        { $sort: { timestamp: -1 } },

        // Group by playerId, keep the latest submission
        {
            $group: {
                _id: '$playerId',
                level: { $first: '$level' },
                timestamp: { $first: '$timestamp' },
            },
        },

        // Lookup player to get stored playerId string
        {
            $lookup: {
                from: 'players',
                localField: '_id',
                foreignField: '_id',
                as: 'player',
            },
        },

        // Flatten player array
        { $unwind: '$player' },

        // Shape final output
        {
            $project: {
                _id: 0,
                playerId: '$player.playerId',
                level: 1,
                timestamp: 1,
            },
        },

        { $sort: { level: -1, timestamp: -1 } },
    ]);

    return results;
};


const Submission = new mongoose.model('Submission', submissionSchema)
module.exports = Submission