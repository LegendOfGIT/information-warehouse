const mongoClient = require('mongodb').MongoClient;

module.exports = () => new Promise((resolve, reject) => {
    mongoClient.connect('mongodb://localhost:27017/information-items')
        .then(database => {
            if(!database) {
                resolve([]);
            }

            const collection = database.db().collection('items');
            collection.find().toArray()
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
