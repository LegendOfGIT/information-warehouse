const FILTER_MAPPING = {
    1000000: { property: 'providers.itemId', value: 'dress-for-less' },
    1000001: { property: 'providers.itemId', value: 'biggreensmile' },
    1000018: { property: 'providers.itemId', value: '100percentpure' },
    1000019: { property: 'providers.itemId', value: 'amazon' },
    1000020: { property: 'providers.itemId', value: 'backmarket' },
    1000021: { property: 'providers.itemId', value: 'bear-family' },
    1000022: { property: 'providers.itemId', value: 'bisbshop' },
    1000023: { property: 'providers.itemId', value: 'buch24' },
    1000024: { property: 'providers.itemId', value: 'ebrosia' },
    1000025: { property: 'providers.itemId', value: 'enners' },

    1000026: { property: 'providers.itemId', value: 'fussmatten-welt' },
    1000027: { property: 'providers.itemId', value: 'haymancoffee' },
    1000028: { property: 'providers.itemId', value: 'hoerner-group' },
    1000029: { property: 'providers.itemId', value: 'idee-shop' },
    1000030: { property: 'providers.itemId', value: 'inhofer' },
    1000031: { property: 'providers.itemId', value: 'iwmhchair' },
    1000032: { property: 'providers.itemId', value: 'janvanderstorm' },
    1000033: { property: 'providers.itemId', value: 'mytoys' },
    1000034: { property: 'providers.itemId', value: 'naturalfoodshop' },
    1000035: { property: 'providers.itemId', value: 'otto' },
    1000036: { property: 'providers.itemId', value: 'pakama' },
    1000037: { property: 'providers.itemId', value: 'plantlife' },
    1000038: { property: 'providers.itemId', value: 'quelle' },
    1000039: { property: 'providers.itemId', value: 'reifen' },
    1000040: { property: 'providers.itemId', value: 'sandawha-skincare' },
    1000041: { property: 'providers.itemId', value: 'shop24direct' },
    1000042: { property: 'providers.itemId', value: 'shop-apotheke' },
    1000043: { property: 'providers.itemId', value: 'songmics' },
    1000044: { property: 'providers.itemId', value: 'studibuch' },
    1000045: { property: 'providers.itemId', value: 'third-of-life' },
    1000046: { property: 'providers.itemId', value: 'timber-taste' },
    1000047: { property: 'providers.itemId', value: 'toom' },
    1000048: { property: 'providers.itemId', value: 'topparfuemerie' },
    1000049: { property: 'providers.itemId', value: 'waschbaer' },
    1000050: { property: 'providers.itemId', value: 'whitecollection' },

    1000014: { property: 'filterInformation.color', value: 'black' },
    1000008: { property: 'filterInformation.color', value: 'blue' },
    1000009: { property: 'filterInformation.color', value: 'brown' },
    1000006: { property: 'filterInformation.color', value: 'darkblue' },
    1000007: { property: 'filterInformation.color', value: 'darkred' },
    1000011: { property: 'filterInformation.color', value: 'gold' },
    1000005: { property: 'filterInformation.color', value: 'gray' },
    1000012: { property: 'filterInformation.color', value: 'green' },
    1000013: { property: 'filterInformation.color', value: 'pink' },
    1000017: { property: 'filterInformation.color', value: 'purple' },
    1000015: { property: 'filterInformation.color', value: 'silver' },
    1000004: { property: 'filterInformation.color', value: 'red' },
    1000016: { property: 'filterInformation.color', value: 'white' },
    1000010: { property: 'filterInformation.color', value: 'yellow' },

    1000002: { property: 'fit', value: 'flare fit' },
    1000003: { property: 'fit', value: 'skinny fit' }
};

module.exports = {
    getFilterPropertiesByFilterIds: (filterIds) => {
        const filterProperties = {};

        (filterIds || []).forEach(filterId => {
            const filterFromMapping = FILTER_MAPPING[filterId];
            if (!filterFromMapping) {
                return;
            }

            const propertyFilters = filterProperties[filterFromMapping.property] || [];
            propertyFilters.push(filterFromMapping);
            filterProperties[filterFromMapping.property] = propertyFilters;
        });

        return filterProperties;
    }
};