
module.exports = (item) => {

    const lowestPriceIsOnSale = () => {
        const providersWithPrices = (item.providers || [])
            .filter(provider => (provider['price-initial'] || 0) > 0 && (provider['price-current'] || 0) > 0)
            .sort((a, b) => (a['price-current'] || 0) - (b['price-current'] || 0));

        const lowestPriceProvider = 0 === providersWithPrices.length ? undefined : providersWithPrices[0];
        return lowestPriceProvider && (lowestPriceProvider['price-current'] < lowestPriceProvider['price-initial']);
    }

    let tags = [];
    if (lowestPriceIsOnSale()) {
        tags.push('sale');
    }

    const splitProperties = ['colors', 'sizes', 'suitableFor']
    splitProperties.forEach(splitProperty => {
        if (item[splitProperty]) {
            tags = tags.concat(item[splitProperty].split(',').map(v => v.trim()));
        }
    });

    const tagMapping = [
        { property: 'fabricPattern', prefix: 'fabric pattern' },
        { property: 'fit', prefix: 'fit' },
        { property: 'make' }
    ];

    tagMapping.forEach(mapping => {
        if (item[mapping.property]) {
            tags.push(`${mapping.prefix ? mapping.prefix : ''} ${item[mapping.property]}`.trim());
        }
    });

    return tags;
};