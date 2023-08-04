const queryInformation = require('../information/repositories/queryInformationRepository');
const filterConfiguration = require('../configuration/filter-configuration');

module.exports = (parameters) => new Promise(async (resolve, reject) => {
    const {
        priceFrom,
        priceTo,
        query
    } = parameters;

    let availableFilters = Object.keys(filterConfiguration.FILTER_MAPPING)
        .map(filterId => {
            queryInformation({
                query,
                priceFrom,
                priceTo,
                filterIds: [filterId]
            })
                .then((items) => {
                    if (items.length > 0) {
                        return {filterId}
                    }
                })
                .catch(() => {
                })
        });

    availableFilters = availableFilters.filter(f => f);
    resolve(availableFilters);
});
