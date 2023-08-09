const queryInformation = require('../information/repositories/queryInformationRepository');
const filterConfiguration = require('../configuration/filter-configuration');

module.exports = (parameters) => new Promise(async (resolve, reject) => {
    const {
        priceFrom,
        priceTo,
        query
    } = parameters;

    const filterPromises = Object.keys(filterConfiguration.FILTER_MAPPING)
        .map(filterId => queryInformation({ query, priceFrom, priceTo, filterIds: [filterId], numberOfResults: 1 }));
    let availableFilters = (await Promise.all(filterPromises))
        .map(items => { return items.length > 0 ? { filterId: items[0].filterId } : undefined; });

    availableFilters = availableFilters.filter(f => f);
    resolve(availableFilters);
});