const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (query, randomItems, numberOfResults) => new Promise((resolve, reject) => {

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then(database => {
            if(!database) {
                resolve([]);
            }

            const queryParts = [{ $match: query }];
            if ((/true/i).test(randomItems)) {
                queryParts.push({ $sample: { size: numberOfResults }});
            }

            database.db().collection('items').find(query).limit(numberOfResults).sort({ updatedOn: -1 }).toArray()
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
