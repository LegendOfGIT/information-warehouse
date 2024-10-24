const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = () => new Promise((resolve, reject) => {
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/stories`)
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
                        id: story.id,
                        canonical: story.canonical,
                        createdOn: story.createdOn,
                        title: story.title,
                        navigationId: story.navigationId
                    })));
                database.close();
            });
        })
        .catch(error => {
            reject(error);
        });
});
