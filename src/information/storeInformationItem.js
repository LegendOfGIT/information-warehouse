const storeInformationRepository = require('./repositories/storeInformationRepository');
const queryVirtualInformationItemsRepository = require('./repositories/queryVirtualInformationItemsRepository');
const storeVirtualInformationItemRepository = require('./repositories/storeVirtualInformationItemRepository');

module.exports = (informationItem) => new Promise((resolve, reject) => {
    storeInformationRepository(informationItem).then(() => {
        const { ean } = informationItem;
        if (!ean) {
            resolve();
            return;
        }

        queryVirtualInformationItemsRepository({ ean }).then((virtualItems) => {
            const virtualItem = virtualItems.length > 0 ? virtualItems[0] : {
                ean,
                correspondingInformationItems : []
            };

            let key = 'title';
            virtualItem[key] = virtualItem[key] || informationItem[key];
            key = 'title-image';
            virtualItem[key] = virtualItem[key] || informationItem[key];
            key = 'navigationPath';
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
