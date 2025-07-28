const fs = require('fs')
const path = require('path')

module.exports = getConfigurationData = () => {
    const filePath = path.join(__dirname, '..', 'workernodes.json')
    const rawData = fs.readFileSync(filePath)
    const config = JSON.parse(rawData)

    if (!config.workerNodes || !Array.isArray(config.workerNodes)) {
        console.log('Invalid configuration file')
        process.exit(1)
    }

    return config.workerNodes
}