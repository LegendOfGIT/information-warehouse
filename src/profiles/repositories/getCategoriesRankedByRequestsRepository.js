const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (hashTag) => new Promise(async (resolve, reject) => {
    if (!hashTag) {
        resolve([]);
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/activities`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection =  database.db().collection('visitedCategories');

            collection.find({ hashTag }).sort({ activityOn: -1 }).limit(300).toArray((err, result) => {
                if (err) throw err;

                const categories = [...new Set(result.map(item => item.categoryId))].map(category => ({
                    categoryId: category,
                    numberOfRequests: result.filter(r => category === r.categoryId).length
                }));
                categories.sort((a, b) =>
                    a.numberOfRequests < b.numberOfRequests ? 1 : -1);

                resolve(categories);
                database.close();
            });
        })
        .catch(error => {
            reject(error);
        });
});
