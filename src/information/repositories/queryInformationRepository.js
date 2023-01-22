const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (query) => new Promise((resolve, reject) => {
    console.log(configuration);

    mongoClient.connect(`mongodb://${configuration.host}:${configuration.port}/information-items`)
        .then(database => {
            if(!database) {
                resolve([]);
            }

            database.db().collection('items').find(query).sort({ updatedOn: -1 }).toArray()
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
