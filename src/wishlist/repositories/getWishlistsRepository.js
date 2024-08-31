const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (userId) => new Promise((resolve, reject) => {
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection = database.db().collection('wishlists');

            collection.find({ userId }).toArray((err, result) => {
                if (err) {
                    database.close();
                    throw err;
                }

                resolve(result);
                database.close();
            });
        })
        .catch(error => {
            reject(error);
        });
});
