const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (userId, searchProfileId) => new Promise((resolve, reject) => {
    if (!userId) {
        console.log('required userId is missing');
        resolve();
        return;
    }

    if (!searchProfileId) {
        console.log('required searchProfileId is missing');
        resolve();
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/profiles`)
        .then((database) => {
            const collection = database.db().collection('searchProfiles');
            collection.removeOne({ id: userId + searchProfileId })
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
