const mongoClient = require('mongodb').MongoClient;

module.exports = (informationItem) => new Promise((resolve, reject) => {
    informationItem = informationItem || {};

    const { ean } = informationItem;
    if (!ean) {
        console.log('required ean is missing');
    }

    informationItem.itemId = `${(informationItem.navigationPath  || []).join('-')}-${ean}`;

    mongoClient.connect('mongodb://localhost:27017/information-items')
        .then((database) => {
            const collection = database.db().collection('virtual-items');
            collection.replaceOne(
                { ean },
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
