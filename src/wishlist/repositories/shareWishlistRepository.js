const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = ({ id, userId, sharedWithHash, isShareRequest }) => new Promise((resolve, reject) => {
    let message = '';
    if (!userId) {
        message = 'required userId is missing';
        console.log(message);
        reject(message);
        return;
    }

    if (!id) {
        message = 'required id is missing';
        console.log(message);
        reject(message);
        return;
    }

    if (isShareRequest && !sharedWithHash) {
        message = 'required sharedWithHash is missing';
        console.log(message);
        reject(message);
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then((database) => {
            const collection = database.db().collection('wishlists');
            collection.updateOne(
                { id, userId },
                {
                    $set: {
                        sharedWithHash,
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
