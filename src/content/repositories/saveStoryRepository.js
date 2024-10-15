const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');

module.exports = ({ id, canonical, title, navigationId, elements }) => new Promise((resolve, reject) => {
    const isNewStory = id === undefined;

    id = id ?? crypto.randomUUID();
    canonical = canonical ?? '';
    title = title ?? '';
    navigationId = navigationId ?? '';
    elements = elements ?? [];

    if (!title) {
        message = 'required title is missing';
        console.log(message);
        reject(message);
        return;
    }

    if (!canonical) {
        message = 'required canonical is missing';
        console.log(message);
        reject(message);
        return;
    }

    const setData = {
        id,
        canonical,
        navigationId,
        title,
        elements
    };

    if (isNewStory) {
        setData.createdOn = new Date();
    }


    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then((database) => {
            const collection = database.db().collection('stories');
            collection.updateOne(
                { id },
                {
                    $set: setData
                },
                { upsert: true }
            )
                .then(() => {
                    resolve({});
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
