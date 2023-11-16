const requestModule = require('request');
const configuration = require('../../configuration/app-config')();

module.exports = (itemId, navigationPath, withHighPriority) => {
    requestModule.post({
        url: `http://${configuration.services.satelliteController.host}:${configuration.services.satelliteController.port}/update-item`,
        json: {
            itemId,
            navigationPath,
            withHighPriority
        }
    }, () => {})
};
