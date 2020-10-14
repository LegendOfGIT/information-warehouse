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

    if (0 === wishlistItems.length) {
        message = 'required wishlistItems are missing';
        console.log(message);
        reject(message);
        return;
    }

    mongoClient.connect('mongodb://localhost:27017/wishlists')
        .then((database) => {
            const collection = database.db().collection('wishlist-items');
            collection.insertOne({
                userId,
                items: wishlistItems
            })
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
