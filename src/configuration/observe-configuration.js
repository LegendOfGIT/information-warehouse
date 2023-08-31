const requestModule = require('request');
const configuration = require('../configuration/app-config')();

let CATEGORY_MAPPING = {};

const updateCategoryMappingWhenNecessary = async () => {
    if (Object.keys(CATEGORY_MAPPING).length > 0) {
        return;
    }

    await requestModule(
        `http://${configuration.services.satellite.host}:${configuration.services.satellite.port}/observe/configuration`,
        {json: true},
        (err, res) => {
            if (err) {
                return;
            }

            CATEGORY_MAPPING = res.body;
        });
}

module.exports = {
    getCategoryIdsByNavigationId: async (navigationId) => {
        await updateCategoryMappingWhenNecessary();
        return (CATEGORY_MAPPING[navigationId] || '').split('|');
    },
    getRandomCategoryIds: async () => {
        await updateCategoryMappingWhenNecessary();
        return Object.values(CATEGORY_MAPPING)[Math.floor(Math.random() * Object.values(CATEGORY_MAPPING).length)]
            .split('|');
    }
};
