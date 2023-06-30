const configuration = require('../../configuration/app-config')();
const filterConfiguration = require('../../configuration/filter-configuration');
const mongoClient = require('mongodb').MongoClient;

module.exports = (query, hashtag, randomItems, numberOfResults, page, filterIds = []) => new Promise((resolve, reject) => {

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
                query[`filterInformation.${propertyFilter.property}`] = RegExp(propertyFilter.value, 'i');
                subQueries.push(query);
            });
            queries.push({ $or: subQueries });
        });

        console.log(queries);
        return { $and: queries };
    };

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then(database => {
            if (!database) {
                resolve([]);
            }

            const priceCheck = numberOfResults > 1 ? { hasPriceInformation: { $in: [true, null] } } : null;
            const sort = {};
            sort['scoring.' + (hashtag || 'noprofile')] = -1;
            sort.ratingInPercent = -1;
            sort.numberOfRatings = -1;
            sort.updatedOn = -1;

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

            queryParts.push({ $match: { ...query, ...priceCheck, ...getFilterQuery(filterIds) } });
            queryParts.push({ $sort: sort });

            if ((/true/i).test(randomItems)) {
                queryParts.push({ $sample: { size: numberOfResults }});
            }

            if (numberOfResults) {
                let p = ((page || 1) - 1);
                queryParts.push({ $skip: numberOfResults * (p < 0 ? 0 : p) });
                queryParts.push({ $limit: numberOfResults });
            }

            database.db().collection('items').aggregate(queryParts).toArray()
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(error => {
            console.log(error);
            reject(error);
        });
});
