const mongoClient = require('mongodb').MongoClient;

module.exports = ({ repository, activityId, userId, items, itemId }) => new Promise((resolve, reject) => {

    mongoClient.connect('mongodb://localhost:27017/activities')
        .then((database) => {
            const collection = database.db().collection('activities');
            collection.insertOne({
                activityId,
                userId,
                itemId
            })
                .then(response => {
                    console.log(itemId);
                    resolve(repository(userId, items));
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
