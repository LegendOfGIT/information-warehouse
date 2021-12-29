const mongoClient = require('mongodb').MongoClient;

module.exports = ({ trackingArguments, repository, repositoryArguments }) => new Promise((resolve, reject) => {

    mongoClient.connect('mongodb://localhost:27017/activities')
        .then((database) => {
            const collection = database.db().collection('activities');
            collection.insertOne(trackingArguments)
                .then(response => {
                    resolve(repository(repositoryArguments));
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
