const fs = require('fs')
const path = require('path')

module.exports = getConfigurationData = () => {
    const filePath = path.join(__dirname, '..', 'workernodes.json')
    const rawData = fs.readFileSync(filePath)
    const config = JSON.parse(rawData)

    if (!config.workers || !Array.isArray(config.workers)) {
        console.log('Invalid configuration file')
        process.exit(1)
    }

    config.workers.forEach(
        w => {
            if (!w.host || !w.port) {
                console.log('Invalid worker entry in config: ', w)
                process.exit(1)
            }
        }
    )

    console.log('Config file validated')
    return config.workers
}