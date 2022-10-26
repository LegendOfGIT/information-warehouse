const mongoClient = require('mongodb').MongoClient;

module.exports = (informationItem) => new Promise((resolve, reject) => {
    informationItem = informationItem || {};

    const { asin, ean } = informationItem;
    if (!asin && !ean) {
        console.log('required article-id (asin or ean) is missing');
    }

    informationItem.itemId = `${(informationItem.navigationPath  || []).join('-')}-${ean || asin}`;

    mongoClient.connect('mongodb://localhost:27017/information-items')
        .then((database) => {
            const collection = database.db().collection('virtual-items');
            collection.replaceOne(
                ean ? { ean } : { asin },
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
