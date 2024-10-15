const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = () => new Promise((resolve, reject) => {
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection = database.db().collection('stories');
            collection.find({}).toArray((err, result) => {
                if (err) {
                    database.close();
                    throw err;
                }

                resolve((result || [])
                    .map(story => ({
                        canonical: story.canonical,
                        title: story.title })));
                database.close();
            });
        })
        .catch(error => {
            reject(error);
        });
});
