const FILTER_MAPPING = {
    1000000: { property: 'providers.itemId', value: 'dress-for-less' },
    1000001: { property: 'providers.itemId', value: 'biggreensmile' },

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

    1000002: { property: 'filterInformation.fit', value: 'flare fit' },
    1000003: { property: 'filterInformation.fit', value: 'skinny fit' }
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