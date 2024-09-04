const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = ({ wishlistId, itemId, userId }) => new Promise((resolve, reject) => {
    let message = '';
    if (!userId) {
        message = 'required userId is missing';
        console.log(message);
        reject(message);
        return;
    }

    if (!wishlistId) {
        message = 'required wishlistId is missing';
        console.log(message);
        reject(message);
        return;
    }

    if (!itemId) {
        message = 'required itemId is missing';
        console.log(message);
        reject(message);
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then((database) => {
            const collection = database.db().collection('wishlists');

            collection.findOne({ id: wishlistId, userId })
                .then((result) => {
                    const items = result.items.filter((item) => item.id !== itemId);

                    collection.updateOne(
                        { id: wishlistId },
                        {
                            $set: {
                                items,
                                lastUpdatedOn: new Date()
                            }
                        },
                        { upsert: true }
                    )
                        .then(() => {
                            resolve();
                        })
                        .catch(error => {
                            reject(error);
                        })
                        .finally(() => {
                            database.close();
                        });
                })
                .catch((error) => {
                    reject(error);
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(error => { reject(error); });
});
