const storeInformationRepository = require('./repositories/storeInformationRepository');
const queryInformationRepository = require('./repositories/queryInformationRepository');

const getItemIdFromInformationItem = (item) => {
    return `${(item.navigationPath  || []).join('-')}-${item.gtin || item.asin || item.ean || item.mean}`;
};

const itemToStoreFromScrapedItem = (storedItem, scrapedItem) => {
    const providerSpecificProperties = ['itemId', 'link', 'mean', 'price-current', 'price-initial', 'updatedOn'];
    const providerAndItemSpecificProperties = ['updatedOn'];

    const itemToStore = {}
    Object.keys(scrapedItem).forEach(propertyKey => {
        if (!providerAndItemSpecificProperties.includes(propertyKey) && providerSpecificProperties.includes(propertyKey)) {
            return;
        }

        itemToStore[propertyKey] = scrapedItem[propertyKey];
    });

    const providerItemToStore = {};
    Object.keys(scrapedItem).forEach(propertyKey => {
        if (!providerSpecificProperties.includes(propertyKey)) {
            return;
        }

        providerItemToStore[propertyKey] = scrapedItem[propertyKey];
    });

    storedItem = storedItem || { itemId: getItemIdFromInformationItem(scrapedItem) };
    let providers = storedItem.providers || [];
    providers = providers.filter(provider => provider.itemId !== providerItemToStore.itemId);
    providers.push(providerItemToStore);

    itemToStore.hasPriceInformation = providers.filter(provider => provider['price-initial'] || provider['price-current']).length > 0;

    return {
        ...storedItem,
        ...itemToStore,
        providers
    };
};

module.exports = (informationItem) => new Promise((resolve, reject) => {
    const storedItemsQuery = {
        $or: [
            { itemId: getItemIdFromInformationItem(informationItem) },
            { providers: { $elemMatch: { itemId: informationItem.itemId || '' }} }
        ]
    };
    queryInformationRepository(storedItemsQuery, 'false',1, 0)
        .then((storedItems) => {
            console.log(storedItems.map(item => item.itemId));

            const itemToStore = itemToStoreFromScrapedItem(storedItems.length ? storedItems[0] : undefined, informationItem);

            storeInformationRepository(itemToStore)
                .then(() => {})
                .finally(() => {
                    resolve();
                });
        })
        .catch((error) => { reject(error); })
});
