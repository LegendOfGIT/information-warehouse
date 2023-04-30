
module.exports = (item) => {

    const lowestPriceIsOnSale = () => {
        const providersWithPrices = (item.providers || [])
            .filter(provider => (provider['price-initial'] || 0) > 0 && (provider['price-current'] || 0) > 0)
            .sort((a, b) => (a['price-current'] || 0) - (b['price-current'] || 0));

        const lowestPriceProvider = 0 === providersWithPrices.length ? undefined : providersWithPrices[0];
        return lowestPriceProvider && (lowestPriceProvider['price-current'] < lowestPriceProvider['price-initial']);
    }

    const tags = [];
    if (lowestPriceIsOnSale()) {
        tags.push('sale');
    }

    if (item.colors) {
        tags.push(item.colors.split(','));
    }

    console.log(item);
    console.log(tags);

    return tags;
};