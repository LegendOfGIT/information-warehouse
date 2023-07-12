const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const queryPartsResolver = require('./queryPartsResolver');

module.exports = (query, numberOfResults, filterIds) => new Promise((resolve, reject) => {

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then(database => {
            if(!database) {
                resolve([]);
            }

            const queryParts = queryPartsResolver(query, numberOfResults, filterIds);
            queryParts.push({ $count: 'totalCount' })

            database.db().collection('items').aggregate(queryParts)
                .then((result) => {
                    resolve(result.totalCount);
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
