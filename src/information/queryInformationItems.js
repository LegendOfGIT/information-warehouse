const queryInformation = require('./repositories/queryInformationRepository')
const queryVirtualInformationItemsRepository = require('./repositories/queryVirtualInformationItemsRepository');

module.exports = (query) => new Promise((resolve, reject) => {
    queryVirtualInformationItemsRepository(query).then((virtualItems) => {
        const informationItemIds = virtualItems.map((virtualItem) => virtualItem.correspondingInformationItems).flat();
        queryInformation({ itemId: { $in: informationItemIds } }).then((informationItems) => {
            const items = virtualItems.map((virtualItem) => {
                const correspondingInformationItems = virtualItem.correspondingInformationItems.map((correspondingInformationItem) => {
                    const informationItem = informationItems.find((item) => item.itemId === correspondingInformationItem);
                    console.log(correspondingInformationItem);
                    if (informationItem) {
                        const propertyKeys = [ 'itemId', 'link', 'price-current', 'price-initial', 'title-image' ]

                        const correspondingInformationItem = {};
                        propertyKeys.forEach((propertyKey) => {
                            correspondingInformationItem[propertyKey] = informationItem[propertyKey];
                        });
                        return correspondingInformationItem;
                    }
                });

                virtualItem.correspondingInformationItems = correspondingInformationItems;
                return virtualItem;
            });

            resolve(items);
        }).catch((error) => { reject(error); })
    }).catch((error) => { reject(error); })
});
