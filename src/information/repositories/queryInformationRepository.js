const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (query, hashtag, randomItems, numberOfResults, page) => new Promise((resolve, reject) => {

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
                query.titleWithoutSpecials = query.title;
                delete query.title;
            }


            const queryParts = [
                {
                    $addFields: {
                        titleWithoutSpecials: {
                            input: "$title",
                            find: /[.*+?^${}()|[\]\\]/g,
                            replacement: ''
                        }
                    }
                },
                { $match: { ...query, ...priceCheck } },
                { $sort: sort}
            ];

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
            reject(error);
        });
});
