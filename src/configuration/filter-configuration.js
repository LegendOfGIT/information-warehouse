const FILTER_MAPPING = {
    1000000: { property: 'providers.itemId', value: 'dress-for-less' },
    1000001: { property: 'providers.itemId', value: 'biggreensmile' },
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