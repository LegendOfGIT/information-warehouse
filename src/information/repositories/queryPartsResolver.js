const filterConfiguration = require('../../configuration/filter-configuration');

module.exports = (query, numberOfResults, filterIds = []) => {

    const getFilterQuery = (filterIds) => {
        const filterProperties = filterConfiguration.getFilterPropertiesByFilterIds(filterIds);
        if (0 === Object.keys(filterProperties).length) {
            return {};
        }

        const queries = [];
        Object.values(filterProperties).forEach(filterProperty => {
            const subQueries = [];
            filterProperty.forEach(propertyFilter => {
                const query = { };
                query[propertyFilter.property] =
                    'string' === typeof propertyFilter.value
                        ? RegExp(propertyFilter.value, 'i')
                        : propertyFilter.value;

                subQueries.push(query);
            });
            queries.push({ $or: subQueries });
        });

        console.log(queries);
        return { $and: queries };
    };

    if (query.title) {
        query.titleWithoutSpecials = new RegExp(`.*${query.title.split(/'|´|`/).join('').replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('ó', 'o')}.*`, 'i');
        delete query.title;
    }

    const queryParts = [
        { $addFields: { titleWithoutSpecials: { $replaceAll: { input: "$title", find: "'", replacement: '' }}}}
    ];

    const specialCharReplacements = {
        '`': '', '´': '', ':': '',
        'á': 'a', 'é': 'e', 'ó': 'o'
    };
    Object.keys(specialCharReplacements).forEach(
        key => queryParts.push({ $addFields: { titleWithoutSpecials: { $replaceAll: { input: "$titleWithoutSpecials", find: key, replacement: specialCharReplacements[key] }}}}));

    const priceCheck = numberOfResults > 1 ? { hasPriceInformation: { $in: [true, null] } } : null;

    queryParts.push({ $match: { ...query, ...priceCheck, ...getFilterQuery(filterIds) } });

    return queryParts;
};
