const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = ({ id, userId }) => new Promise((resolve, reject) => {
    let message = '';

    if (!id) {
        message = 'required id is missing';
        console.log(message);
        reject(message);
        return;
    }

    if (!userId) {
        message = 'required userId is missing';
        console.log(message);
        reject(message);
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then((database) => {
            database.db().collection('wishlists').removeMany({ id })
                .then(() => {
                    resolve({})
                })
                .catch((error) => { reject(error); });
        })
        .catch(error => { reject(error); });
});
