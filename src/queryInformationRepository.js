const mongoClient = require('mongodb').MongoClient;

module.exports = (queryPattern, navigationId) => new Promise((resolve, reject) => {
    mongoClient.connect('mongodb://localhost:27017/information-items')
        .then(database => {
            if(!database) {
                resolve([]);
            }

            const collection = database.db().collection('items');
            const query = {};
            if (queryPattern) {
                query.title = new RegExp(`.*${queryPattern}.*`, 'i')
            }
            if (navigationId) {
                query.navigationPath = navigationId
            }

            collection.find(query).toArray()
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(error => {
            reject(error);
        });
});
