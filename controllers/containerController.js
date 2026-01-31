const axios = require('axios')
const { signPayload } = require('./userController')


const deleteContainer = async (player) => {
    const WORKER_NODES = global.WORKER_NODES
    const deletionsignature = signPayload({ containerId: player.containerId });

    const response = await axios.delete(
        `http://${player.hostIP}:${WORKER_NODES.get(player.hostIP)}/api/container/deleteContainer`,
        {
            data: {
                containerId: player.containerId
            },
            headers: {
                'X-Signature': deletionsignature
            }
        }
    );
    return response.data
};

const createContainer = async (player, levelObj) => {
    const WORKER_NODES = global.WORKER_NODES
    const creationsignature = signPayload({ imageName: levelObj.imageName })
    const response = await axios.post(
        `http://${player.hostIP}:${WORKER_NODES.get(player.hostIP)}/api/container/createContainer`,
        {
            imageName: levelObj.imageName,
        },
        {
            headers: {
                'X-Signature': creationsignature
            },
        }
    );
    return response.data
}

module.exports = {
    deleteContainer,
    createContainer
}