const requestModule = require('axios');
const configuration = require('../configuration/app-config')();

let CATEGORY_MAPPING = {};

const updateCategoryMappingWhenNecessary = async () => {
    if (Object.keys(CATEGORY_MAPPING).length > 0) {
        return;
    }

    await requestModule.get(
        `http://${configuration.services.satellite.host}:${configuration.services.satellite.port}/observe/configuration`,
    )
    .then(() => {

    })
    .catch((response) => {
        CATEGORY_MAPPING = response.data;
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
