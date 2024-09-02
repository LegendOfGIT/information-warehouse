const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');

module.exports = ({ wishlistId, userId, url, title, titleImage, description, itemWasBought }) => new Promise((resolve, reject) => {
    description = description ?? '';
    title = title ?? '';
    titleImage = titleImage ?? '';
    itemWasBought = itemWasBought ?? false;

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

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then((database) => {
            const collection = database.db().collection('wishlists');
            collection.updateOne(
                { id: wishlistId },
                {
                    $push: {
                        items: {
                            id: crypto.randomUUID(),
                            url,
                            title,
                            titleImage,
                            description,
                            itemWasBought,
                            lastUpdatedOn: new Date()
                        }
                    },
                    $set: {
                        userId,
                        lastUpdatedOn: new Date()
                    }
                },
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
