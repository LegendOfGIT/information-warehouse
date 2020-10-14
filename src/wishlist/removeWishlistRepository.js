const mongoClient = require('mongodb').MongoClient;

module.exports = (userId) => new Promise((resolve, reject) => {
    if (!userId) {
        const message = 'required userId is missing';
        console.log(message);
        reject(message);
        return;
    }

    mongoClient.connect('mongodb://localhost:27017/wishlists')
        .then((database) => {
            const collection = database.db().collection('wishlist-items');
            collection.removeOne({ userId })
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
