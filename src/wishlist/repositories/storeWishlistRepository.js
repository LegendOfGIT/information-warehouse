const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');

module.exports = ({ id, userId, title, description, imageId }) => new Promise((resolve, reject) => {
    let message = '';
    if (!userId) {
        message = 'required userId is missing';
        console.log(message);
        reject(message);
        return;
    }

    if (!title) {
        message = 'required title is missing';
        console.log(message);
        reject(message);
        return;
    }

    id = id ?? crypto.randomUUID();
    imageId = imageId ?? 'WISHLIST_IMAGE_01';

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then((database) => {
            const collection = database.db().collection('wishlists');
            collection.updateOne(
                { id },
                {
                    $set: {
                        userId,
                        title,
                        description,
                        imageId,
                        lastUpdatedOn: new Date()
                    }},
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
