const axios = require('axios')
const { signPayload } = require('./userController')

const deleteContainer = async (player) => {
    const deletionsignature = signPayload({ containerId: player.containerId });

    const response = await axios.delete(
        `http://${player.hostIP}:8751/api/container/deleteContainer`,
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
    const creationsignature = signPayload({ imageName: levelObj.imageName })
    const response = await axios.post(
        `http://${player.hostIP}:8751/api/container/createContainer`,
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