const queryInformation = require('../information/repositories/queryInformationRepository');
const filterConfiguration = require('../configuration/filter-configuration');
const cache = require('../cache/cache');

const getCacheKey = (parameters) => {
    const {
        priceFrom,
        priceTo,
        query
    } = parameters;

    return `GAFIL||${[query.title, query.navigationPath, priceFrom, priceTo].join('||')}`;
};

module.exports = (parameters) => new Promise(async (resolve) => {
    const {
        priceFrom,
        priceTo,
        query
    } = parameters;

    const cacheKey = getCacheKey(parameters);
    if (cache.has(cacheKey)) {
        resolve(cache.get(cacheKey));
        return;
    }

    const filterPromises = Object.keys(filterConfiguration.FILTER_MAPPING)
        .map(filterId => queryInformation({ query, priceFrom, priceTo, filterIds: [filterId], numberOfResults: 1 }));
    let availableFilters = (await Promise.all(filterPromises))
        .map(items => { return items.length > 0 ? { filterId: items[0].filterId } : undefined; });

    availableFilters = availableFilters.filter(f => f);

    cache.set(cacheKey, availableFilters, 1800);
    resolve(availableFilters);
});
