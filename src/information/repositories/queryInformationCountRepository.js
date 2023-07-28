const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const queryPartsResolver = require('./queryPartsResolver');

module.exports = (query, priceFrom, priceTo, numberOfResults, filterIds) => new Promise((resolve, reject) => {

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then(database => {
            if(!database) {
                resolve([]);
            }

            const queryParts = queryPartsResolver(query, priceFrom, priceTo, numberOfResults, filterIds);
            queryParts.push({ $count: 'totalCount' });

            database.db().collection('items').aggregate(queryParts).toArray()
                .then((result) => {
                    resolve((result[0] || { totalCount: 0 }).totalCount);
                })
                .catch((error) => {
                    console.log(error);
                    resolve(0);
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(error => {
            reject(error);
        });
});
