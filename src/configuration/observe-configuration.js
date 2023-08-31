const requestModule = require('request');

let CATEGORY_MAPPING = {};

const updateCategoryMappingWhenNecessary = () => {
    if (Object.keys(CATEGORY_MAPPING).length > 0) {
        return;
    }

    requestModule(
        `http://${configuration.services.satellite.host}:${configuration.services.satellite.port}/observe/configuration`,
        { json: true },
        (err, res) => {
            if (err) { return; }

            CATEGORY_MAPPING = res;
        });
}

module.exports = {
    getCategoryIdsByNavigationId: async (navigationId) => {
        await updateCategoryMappingWhenNecessary();

        console.log(CATEGORY_MAPPING);
        return (CATEGORY_MAPPING[navigationId] || '').split('|');
    },
    getRandomCategoryIds: async () => {
        await updateCategoryMappingWhenNecessary();

        if (Object.keys(CATEGORY_MAPPING).length === 0) {
            return [];
        }

        return Object.values(CATEGORY_MAPPING)[Math.floor(Math.random() * Object.values(CATEGORY_MAPPING).length)]
            .split('|');
    }
};
