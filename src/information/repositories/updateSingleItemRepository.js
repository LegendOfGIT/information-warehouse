const requestModule = require('axios');
const configuration = require('../../configuration/app-config')();

module.exports = (itemId, navigationPath, withHighPriority) => {
    requestModule.post(
        `http://${configuration.services.satelliteController.host}:${configuration.services.satelliteController.port}/update-item`,
        {
            itemId,
            navigationPath,
            withHighPriority
        }
    ).then(() => {}).catch(() => {});
};
