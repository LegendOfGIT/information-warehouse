const storeInformationRepository = require('./repositories/storeInformationRepository');
const queryInformationRepository = require('./repositories/queryInformationRepository');
const filterInformationResolver = require('./resolver/filterInformationResolver');
const tagsResolver = require('./resolver/tagsResolver');

const getItemIdFromInformationItem = (item) => {
    return `${(item.navigationPath  || []).join('-')}-${item.gtin || item.asin || item.ean || item.mean}`;
};

const updatePriceHistoryOfItem = (item) => {
    if (!(item?.providers || []).length) {
        return;
    }

    const latestLowestPrice = Math.min((item.providers || []).map(provider => provider['price-current'] || 0));
    if (!latestLowestPrice) {
        return;
    }

    console.log(latestLowestPrice);

    const todaysDate = new Date().getDate();
    const priceHistory = (item.priceHistory || []);
    let todaysHistoryEntry = priceHistory.find(historyEntry => todaysDate === historyEntry.date.getDate());
    if (!todaysHistoryEntry) {
        todaysHistoryEntry = { date: new Date() };
        priceHistory.push(todaysHistoryEntry);
    }

    todaysHistoryEntry.lowestCurrentPrice = latestLowestPrice;

    item.priceHistory = priceHistory;
}

const itemToStoreFromScrapedItem = (storedItem, scrapedItem, overrideProviders) => {
    const providerSpecificProperties = [
        'amountInStock',
        'itemId',
        'link',
        'mean',
        'price-current',
        'price-initial',
        'pricePerUnit',
        'productCondition',
        'referenceUnit',
        'updatedOn'];

    const providerAndItemSpecificProperties = ['updatedOn'];

    const itemToStore = {}
    Object.keys(scrapedItem).forEach(propertyKey => {
        if (!providerAndItemSpecificProperties.includes(propertyKey) && providerSpecificProperties.includes(propertyKey)) {
            return;
        }

        itemToStore[propertyKey] =
            undefined !== scrapedItem[propertyKey]
                ? scrapedItem[propertyKey]
                : itemToStore[propertyKey];
    });

    const providerItemToStore = {};
    Object.keys(scrapedItem).forEach(propertyKey => {
        if (!providerSpecificProperties.includes(propertyKey)) {
            return;
        }

        providerItemToStore[propertyKey] =
            undefined !== scrapedItem[propertyKey]
                ? scrapedItem[propertyKey]
                : providerItemToStore[propertyKey];
    });

    storedItem = storedItem || { itemId: getItemIdFromInformationItem(scrapedItem) };

    let providers = storedItem.providers || [];
    if (overrideProviders) { providers = itemToStore.providers; }
    else {
        providers = providers.filter(provider => provider.itemId !== providerItemToStore.itemId);
        let providerId = providerItemToStore.mean || '';
        providerId = providerId.split('.').length > 1 ? providerId.split('.')[0] : '';
        if (providerId) {
            providers = providers.filter(provider => !provider.mean || !provider.mean.startsWith(providerId));
        }

        providers.push(providerItemToStore);
    }

    itemToStore.hasPriceInformation = providers.filter(provider => provider['price-initial'] || provider['price-current']).length > 0;
    itemToStore.isInStock = providers.filter(provider => undefined === provider.amountInStock || provider.amountInStock > 0).length > 0;
    updatePriceHistoryOfItem(itemToStore);

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

module.exports = (informationItem, overrideProviders = false) => new Promise((resolve, reject) => {
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
                const itemToStore = itemToStoreFromScrapedItem(storedItem, informationItem, overrideProviders);

                storeInformationRepository(itemToStore)
                    .then(() => {})
                    .finally(() => {});
            });

            resolve();
        })
        .catch((error) => { reject(error); })
});
