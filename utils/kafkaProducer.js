const { Kafka, logLevel } = require('kafkajs')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const kafka = new Kafka({
    clientId: 'ctf-mgmt-server-producer',
    brokers: process.env.KAFKA_BROKERS.split(','),
    logLevel: logLevel.ERROR
})

const producer = kafka.producer()

async function connectProducer() {
    await producer.connect()
    console.log('Kafka producer connected!')
}

const sendEvent = async (topic, message) => {
    await producer.send({
        topic,
        messages: [
            {
                value: JSON.stringify(message)
            }
        ]
    })
}

module.exports = {
    connectProducer,
    sendEvent
}