const storeInformationRepository = require('./repositories/storeInformationRepository');
const queryVirtualInformationItemsRepository = require('./repositories/queryVirtualInformationItemsRepository');
const storeVirtualInformationItemRepository = require('./repositories/storeVirtualInformationItemRepository');

module.exports = (informationItem) => new Promise((resolve, reject) => {
    storeInformationRepository(informationItem).then(() => {
        const { asin, ean } = informationItem;
        if (!asin && !ean) {
            resolve();
            return;
        }

        queryVirtualInformationItemsRepository(ean ? { ean } : { asin }).then((virtualItems) => {
            const virtualItem = virtualItems.length > 0
                ? virtualItems[0]
                : {
                    asin,
                    ean,
                    correspondingInformationItems : []
                };

            let key = 'title';
            virtualItem[key] = virtualItem[key] || informationItem[key];
            key = 'title-image';
            virtualItem[key] = virtualItem[key] || informationItem[key];
            key = 'navigationPath';
            virtualItem[key] = virtualItem[key] || informationItem[key];
            key = 'updatedOn';
            virtualItem[key] = virtualItem[key] || informationItem[key];

            if (!virtualItem.correspondingInformationItems.includes(informationItem.itemId)) {
                virtualItem.correspondingInformationItems.push(informationItem.itemId)
            }

            storeVirtualInformationItemRepository(virtualItem).then(() => {
                resolve();
            }).catch((error) => { reject(error); })

        }).catch((error) => {
            reject(error);
        })

    }).catch((error) => {
        reject(error);
    });
});
