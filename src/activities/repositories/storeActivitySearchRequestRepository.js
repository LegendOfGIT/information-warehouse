const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (navigationPath, searchPattern, numberOfResults, isBotRequest) => new Promise((resolve) => {
    if (isBotRequest) {
        resolve();
        return;
    }

    if (numberOfResults) {
        resolve();
        return;
    }

    if (!searchPattern) {
        resolve();
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/activities`)
        .then((database) => {
            const collection = database.db().collection('searchRequests');

            const date2MonthAgo = new Date();
            date2MonthAgo.setMonth(date2MonthAgo.getMonth() - 1);

            collection.removeMany({ activityOn: { $lt: date2MonthAgo }}).then(() => {}).catch(() => {})
                .then(() => {})
                .catch(() => {});

            collection.insertOne({
                navigationPath,
                searchPattern,
                activityOn: new Date()
            })
                .then(response => {
                    resolve(response);
                })
                .catch(() => {
                    resolve();
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(() => { resolve(); });
});
