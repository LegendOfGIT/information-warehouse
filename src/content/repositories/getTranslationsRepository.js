const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (locale) => new Promise((resolve, reject) => {
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection = database.db().collection('translations');
            collection.findOne({ locale })
                .then((result) => {
                    resolve(result === undefined ? {} : result.translations);
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
