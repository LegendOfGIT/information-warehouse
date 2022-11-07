const mongoClient = require('mongodb').MongoClient;

module.exports = (userId) => new Promise(async (resolve, reject) => {
    mongoClient.connect('mongodb://localhost:27017/profiles')
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection = database.db().collection('searchProfiles');

            collection.find({ userId }).toArray((err, result) => {
                if (err) throw err;

                resolve(result.map(res => res.searchProfile));
                database.close();
            });
        })
        .catch(error => {
            reject(error);
        });
});
