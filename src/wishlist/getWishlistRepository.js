const mongoClient = require('mongodb').MongoClient;

module.exports = (userId) => new Promise((resolve, reject) => {
    mongoClient.connect('mongodb://localhost:27017/wishlists')
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection = database.db().collection('wishlist-items');

            collection.find({ userId })
                .then((result) => {
                    resolve(result.items);
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
