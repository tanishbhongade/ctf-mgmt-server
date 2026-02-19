const { Kafka, logLevel } = require('kafkajs');
const leaderboardState = require('./leaderboardState');
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const runConsumer = async () => {
    const consumer = new Kafka({
        clientId: 'ctf-mgmt-server',
        brokers: process.env.KAFKA_BROKERS.split(','),
        logLevel: logLevel.ERROR
    }).consumer({ groupId: `leaderboard-group-${Date.now()}` });

    await consumer.connect();
    await consumer.subscribe({ topic: 'player-submissions', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const event = JSON.parse(message.value.toString());
            let currentList = leaderboardState.getLeaderboard();

            const index = currentList.findIndex(p => p.playerId === event.playerId);

            if (index !== -1) {
                currentList[index] = {
                    playerId: event.playerId,
                    level: event.level,
                    timestamp: event.timestamp
                };
            } else {
                currentList.push(event);
            }

            currentList.sort((a, b) => {
                if (b.level !== a.level) {
                    return b.level - a.level;
                }
                return a.timestamp - b.timestamp;
            });

            leaderboardState.setLeaderboard(currentList);
        },
    });

    console.log("Kafka consumer is listening");
};

module.exports = { runConsumer };