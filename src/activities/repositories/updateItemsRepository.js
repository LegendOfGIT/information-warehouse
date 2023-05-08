const requestModule = require('request');
const configuration = require('../../configuration/app-config')();

const updateItem = (item) => {
    const url = `http://${configuration.services.satelliteController.host}:${configuration.services.satelliteController.port}/update-item`;

    (item.providers || []).filter(provider => !provider.mean).forEach(provider => {
        let itemId = provider.itemId || (item.mean || (item.asin ? `azo.${item.asin}` : ''));
        itemId =
            -1 !== (itemId || '').indexOf('otto.de') ? itemId.replace('otto.de-', 'otto.') :
            -1 !== (itemId || '').indexOf('amazon.de') ? itemId.replace('amazon.de-', 'azo.') :
            -1 !== (itemId || '').indexOf('dress-for-less.de') ? itemId.replace('dress-for-less.de-', 'dfl.') :
            itemId;

        requestModule.post({
            url,
            json: {
                itemId,
                navigationPath: item.navigationPath }
        }, () => {});
    });

    (item.providers || []).filter(provider => provider.mean).forEach(provider => {
        requestModule.post({
            url,
            json: { itemId: provider.mean, navigationPath: item.navigationPath }
        }, () => {});
    });
};

module.exports = (items, maximumNumberOfResults) => new Promise((resolve) => {
    if (maximumNumberOfResults && maximumNumberOfResults > 1) {
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
