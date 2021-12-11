const mongoClient = require('mongodb').MongoClient;

module.exports = (userId, wishlistItems) => new Promise((resolve, reject) => {
    wishlistItems = wishlistItems || [];

    let message = '';
    if (!userId) {
        message = 'required userId is missing';
        console.log(message);
        reject(message);
        return;
    }

    mongoClient.connect('mongodb://localhost:27017/wishlists')
        .then((database) => {

            const collection = database.db().collection('wishlist-items');
            collection.updateOne(
                { userId },
                { $set: { items: wishlistItems } },
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
