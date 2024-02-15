const filterConfiguration = require('../../configuration/filter-configuration');
const ObjectID = require('mongodb').ObjectID;

module.exports = (query, priceFrom, priceTo, numberOfResults, createdToday = '', filterIds = []) => {

    const getFilterQuery = (priceFrom, priceTo, filterIds) => {
        const filterProperties = filterConfiguration.getFilterPropertiesByFilterIds(filterIds);
        if (!priceFrom && !priceTo && 0 === Object.keys(filterProperties).length) {
            return {};
        }

        const queries = [];
        if (priceFrom) {
            queries.push({ "providers.price-current": { $gte: Number.parseInt(priceFrom) } })
        }
        if (priceTo) {
            queries.push({ "providers.price-current": { $lte: Number.parseInt(priceTo) } })
        }

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

        return { $and: queries };
    };

    if (query.title) {
        query.titleWithoutSpecials = new RegExp(`.*${query.title.split(/'|´|`/).join('').replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('ó', 'o')}.*`, 'i');
        delete query.title;
    }

    if ((/true/i).test(createdToday)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query._id = { $gte: ObjectID.createFromTime(today / 1000) };
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
    const stockCheck = numberOfResults > 1 ? { isInStock: { $in: [true, null] } } : null;

    queryParts.push({ $match: { ...query, ...priceCheck, ...stockCheck, ...getFilterQuery(priceFrom, priceTo, filterIds) } });

    return queryParts;
};
