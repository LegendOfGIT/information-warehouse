const requestModule = require('request');
const configuration = require('../../configuration/app-config')();

const updateItem = (item) => {
    const url = `http://${configuration.services.satelliteController.host}:${configuration.services.satelliteController.port}/update-item`;

    if (!(item.providers || []).filter(provider => provider.mean).length) {
        let itemId = item.mean || (item.asin ? `azo.${item.asin}` : '');
        itemId = itemId
            ? itemId
            : -1 !== (item.itemId || '').indexOf('otto.de')
                ? item.itemId.replace('otto.de-', 'otto.')
                : '';

        requestModule.post({
            url,
            json: {
                itemId,
                navigationPath: item.navigationPath }
        }, () => {});

        return;
    }

    (item.providers || []).forEach(provider => {
        requestModule.post({
            url,
            json: { itemId: provider.mean, navigationPath: item.navigationPath }
        }, () => {});
    });
};

module.exports = (items, searchProfileId, maximumNumberOfResults) => new Promise((resolve) => {
    if (undefined === searchProfileId) {
        resolve();
        return;
    }

    if (maximumNumberOfResults) {
        resolve();
        return;
    }

    if (items.length <= 3) {
        items.forEach(item => updateItem(item));
        resolve();
        return;
    }

    for (let i=1; i<=3; i++) {
        updateItem(items[Math.floor(Math.random() * items.length)]);
    }


    resolve();
});
