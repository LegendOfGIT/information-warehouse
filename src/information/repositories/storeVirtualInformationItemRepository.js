const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (informationItem) => new Promise((resolve, reject) => {
    informationItem = informationItem || {};

    const { asin, gtin, ean } = informationItem;
    if (!asin && !gtin && !ean) {
        console.log('required article-id (gtin, asin or ean) is missing');
    }

    informationItem.itemId = `${(informationItem.navigationPath  || []).join('-')}-${gtin || asin || ean}`;

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then((database) => {
            const collection = database.db().collection('virtual-items');
            collection.replaceOne(
                gtin ? { gtin } : ean ? { ean } : { asin },
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
