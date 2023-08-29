const storeInformationRepository = require('./repositories/storeInformationRepository');
const queryInformationRepository = require('./repositories/queryInformationRepository');
const filterInformationResolver = require('./resolver/filterInformationResolver');
const tagsResolver = require('./resolver/tagsResolver');

const getItemIdFromInformationItem = (item) => {
    return `${(item.navigationPath  || []).join('-')}-${item.gtin || item.asin || item.ean || item.mean}`;
};

const itemToStoreFromScrapedItem = (storedItem, scrapedItem) => {
    const providerSpecificProperties = [
        'amountInStock',
        'itemId',
        'link',
        'mean',
        'price-current',
        'price-initial',
        'productCondition',
        'updatedOn'];

    const providerAndItemSpecificProperties = ['updatedOn'];

    const itemToStore = {}
    Object.keys(scrapedItem).forEach(propertyKey => {
        if (!providerAndItemSpecificProperties.includes(propertyKey) && providerSpecificProperties.includes(propertyKey)) {
            return;
        }

        itemToStore[propertyKey] = scrapedItem[propertyKey] ? scrapedItem[propertyKey] : itemToStore[propertyKey];
    });

    console.log(scrapedItem);
    const providerItemToStore = {};
    Object.keys(scrapedItem).forEach(propertyKey => {
        if (!providerSpecificProperties.includes(propertyKey)) {
            return;
        }

        providerItemToStore[propertyKey] = scrapedItem[propertyKey] ? scrapedItem[propertyKey] : providerItemToStore[propertyKey];
    });

    storedItem = storedItem || { itemId: getItemIdFromInformationItem(scrapedItem) };
    let providers = storedItem.providers || [];
    providers = providers.filter(provider => provider.itemId !== providerItemToStore.itemId);
    providers.push(providerItemToStore);

    itemToStore.hasPriceInformation = providers.filter(provider => provider['price-initial'] || provider['price-current']).length > 0;
    console.log(providers);
    itemToStore.isInStock = providers.filter(provider => undefined === provider.amountInStock || provider.amountInStock > 0).length > 0;

    const providersWithBothPrices = providers.filter(provider => provider['price-initial'] && provider['price-current']);
    const reductions = providersWithBothPrices.map(p => (100 - (p['price-current'] * 100 / p['price-initial'])));
    const highestReductionInPercent = Math.ceil(Math.max(...reductions));
    itemToStore.highestReductionInPercent = highestReductionInPercent > 0 ? highestReductionInPercent : undefined;

    storedItem.scoring = storedItem.scoring || {};
    storedItem.scoring['Schnäppchen'] = (itemToStore.highestReductionInPercent || 0) > 10 ? itemToStore.highestReductionInPercent : 0;

    itemToStore.filterInformation = filterInformationResolver(itemToStore);
    itemToStore.tags = tagsResolver(itemToStore);

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
    queryInformationRepository({
        query: storedItemsQuery,
        randomItems: 'false'
    })
        .then((storedItems) => {
            storedItems = storedItems.length ? storedItems : [undefined];
            storedItems.forEach(storedItem => {
                const itemToStore = itemToStoreFromScrapedItem(storedItem, informationItem);

                storeInformationRepository(itemToStore)
                    .then(() => {})
                    .finally(() => {});
            });

            resolve();
        })
        .catch((error) => { reject(error); })
});
