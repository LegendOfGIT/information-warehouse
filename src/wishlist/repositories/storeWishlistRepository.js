const {uuidV4} = require("mongodb/lib/core/utils");
const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = ({ id, userId, title, description }) => new Promise((resolve, reject) => {
    id = id ?? uuidV4();

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
                    $set: {
                        userId,
                        title,
                        description
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
