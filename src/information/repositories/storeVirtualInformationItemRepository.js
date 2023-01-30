const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (informationItem) => new Promise((resolve, reject) => {
    informationItem = informationItem || {};

    const { asin, gtin } = informationItem;
    if (!asin && !gtin) {
        console.log('required article-id (asin or gtin) is missing');
    }

    informationItem.itemId = `${(informationItem.navigationPath  || []).join('-')}-${gtin || asin}`;

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then((database) => {
            const collection = database.db().collection('virtual-items');
            collection.replaceOne(
                gtin ? { gtin } : { asin },
                informationItem,
                { upsert: true }
            )
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(error => { reject(error); });
});
