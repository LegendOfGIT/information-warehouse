const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (navigationPath, searchPattern) => new Promise((resolve, reject) => {
    if (!searchPattern) {
        resolve([]);
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/activities`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection =  database.db().collection('searchRequests');
            const query = { searchPattern: new RegExp(`${searchPattern}.*`) };
            if (navigationPath) {
                query.navigationPath = new RegExp(`${navigationPath}.*`);
            }
            collection.find(query).sort({ activityOn: -1 }).toArray((err, result) => {
                if (err) {
                    database.close();
                    throw err;
                }

                const suggestions = [...new Set(result.map(item => item.searchPattern))].map(pattern => ({
                    suggestion: pattern,
                    numberOfRequests: result.filter(r => pattern === r.searchPattern).length
                }));
                suggestions.sort((a, b) =>
                    a.numberOfRequests < b.numberOfRequests ? 1 : -1);

                console.log(suggestions);

                resolve(suggestions);
                database.close();
            });
        })
        .catch(error => {
            reject(error);
        });
});
