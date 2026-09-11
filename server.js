const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })

const PORT = process.env.PORT
const DB_PORT = process.env.DB_PORT
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_IPADDR = process.env.DB_IPADDR

const getConfigurationData = require('./utils/configPuller')
global.WORKER_NODES = new Map()
global.WORKER_HOSTS = [];

const workers = getConfigurationData()

workers.forEach(w => {
    global.WORKER_NODES.set(w.host, w.port)
    global.WORKER_HOSTS.push(w.host)
})


const wargamesDB = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_IPADDR}:${DB_PORT}/wargames?authSource=admin`

mongoose.connect(wargamesDB)
    .then(() => {
        console.log('Connected to DB successfully!')
    })

app.listen(PORT, () => {
    console.log("CTF Management server running on port", PORT)
})