const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');

module.exports = ({ id, title, description, typeOfItem, navigationId, links, address, images }) => new Promise((resolve, reject) => {
    const isNewItem = id === undefined;

    id = id ?? crypto.randomUUID();
    links = links ?? [];
    description = description ?? '';
    title = title ?? '';
    typeOfItem = typeOfItem ?? 'SHOP';
    navigationId = navigationId ?? '';

    if (!title) {
        message = 'required title is missing';
        console.log(message);
        reject(message);
        return;
    }

    const setData = {
        id,
        typeOfItem,
        navigationId,
        title,
        description,
        links,
        address,
        images
    };

    if (isNewItem) {
        setData.createdOn = new Date();
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/items-of-interest`)
        .then((database) => {
            const collection = database.db().collection('items-of-interest');
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
