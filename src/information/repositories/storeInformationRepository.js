const mongoClient = require('mongodb').MongoClient;

module.exports = (informationItem) => new Promise((resolve, reject) => {
    if (!informationItem?.itemId) {
        console.log('required itemId is missing');
    }

    mongoClient.connect('mongodb://localhost:27017/information-items')
        .then((database) => {
            const collection = database.db().collection('items');
            console.log(informationItem);
            collection.replaceOne(
                { itemId: informationItem.itemId },
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
