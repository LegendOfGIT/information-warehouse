const updateSingleItemRepository = require('../../information/repositories/updateSingleItemRepository');

const getReworkedItemId = (itemId) => {
    return -1 !== (itemId || '').indexOf('otto.de') ? itemId.replace('otto.de-', 'otto.') :
        -1 !== (itemId || '').indexOf('amazon.de') ? itemId.replace('amazon.de-', 'azo.') :
        -1 !== (itemId || '').indexOf('dress-for-less.de') ? itemId.replace('dress-for-less.de-', 'dfl.') :
        itemId;
};

const updateItem = (item) => {
    (item.providers || []).filter(provider => !provider.mean).forEach(provider => {
        let itemId = provider.itemId || (item.mean || (item.asin ? `azo.${item.asin}` : ''));
        itemId = getReworkedItemId(itemId);

        updateSingleItemRepository(itemId, item.navigationPath);
    });

    (item.providers || []).filter(provider => provider.mean).forEach(provider => {
        updateSingleItemRepository(provider.mean, item.navigationPath);
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
