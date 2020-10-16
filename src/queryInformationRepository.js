const mongoClient = require('mongodb').MongoClient;

module.exports = (query) => new Promise((resolve, reject) => {
    mongoClient.connect('mongodb://localhost:27017/information-items')
        .then(database => {
            if(!database) {
                resolve([]);
            }

            database.db().collection('items').find(query).toArray()
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
