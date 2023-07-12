const configuration = require('../../configuration/app-config')();
const queryPartsResolver = require("./queryPartsResolver");
const mongoClient = require('mongodb').MongoClient;

module.exports = (query, hashtag, randomItems, numberOfResults, page, filterIds = []) => new Promise((resolve, reject) => {
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then(database => {
            if (!database) {
                resolve([]);
            }

            const queryParts = queryPartsResolver(query, numberOfResults, filterIds);

            const sort = {};
            sort['scoring.' + (hashtag || 'noprofile')] = -1;
            sort.ratingInPercent = -1;
            sort.numberOfRatings = -1;
            sort.updatedOn = -1;

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
