const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (id) => new Promise((resolve, reject) => {
    if (!id) {
        console.log('required id is missing');
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then((database) => {
            const collection = database.db().collection('stories');
            collection.removeOne({ id })
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
