
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

    const splitProperties = [
        { key: 'colors' },
        { key: 'sizes' },
        { key: 'suitableFor' }
    ];
    splitProperties.forEach(splitProperty => {
        if (item[splitProperty.key]) {
            const innerSeparators = 'sizes' === splitProperty.key ? /&/ : /&|\//;
            tags = tags.concat(item[splitProperty.key].split(',').map(a => a.split(innerSeparators)).flat());

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


    const tagReplacements = {
        berry: 'purple',
        blau: 'blue', braun: 'brown',
        dunkelblau: 'darkblue',
        gelb: 'yellow', grau: 'gray', grün: 'green',
        navy: 'darkblue',
        rot: 'red',
        schwarz: 'black',
        weiß: 'white'
    };
    tags = tags.map(tag => { const t = tag.trim().toLowerCase(); return tagReplacements[t] ? tagReplacements[t] : t; })
        .filter((value, index, array) => array.indexOf(value) === index);

    return tags;
};