const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (userId, searchProfile) => new Promise((resolve, reject) => {
    let message = '';
    if (!userId || !searchProfile?.id) {
        message = 'required userId or search-profile id is missing';
        console.log(message);
        reject(message);
        return;
    }

    const id = userId + searchProfile.id;
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/profiles`)
        .then((database) => {
            const collection = database.db().collection('searchProfiles');
            collection.updateOne(
                { id },
                {
                    $set: {
                        id,
                        userId,
                        searchProfile
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
