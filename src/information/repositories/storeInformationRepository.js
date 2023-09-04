const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (informationItem) => new Promise((resolve) => {
    if (!informationItem?.itemId) {
        console.log('required itemId is missing');
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then((database) => {
            const collection = database.db().collection('items');
            collection.replaceOne(
                { itemId: informationItem.itemId },
                informationItem,
                { upsert: true }
            )
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.log(error);
                    resolve();
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(error => {
            console.log(error);
            resolve();
        });
});
