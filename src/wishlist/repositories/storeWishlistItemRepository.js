const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');

module.exports = ({ id, userId, title, titleImage, description, itemWasBought }) => new Promise((resolve, reject) => {
    id = id ?? crypto.randomUUID();
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

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then((database) => {
            const collection = database.db().collection('wishlists');
            collection.updateOne(
                { id },
                {
                    $push: {
                        items: {
                            title,
                            titleImage,
                            description,
                            itemWasBought
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
