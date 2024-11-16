const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = () => new Promise((resolve, reject) => {
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/items-of-interest`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection = database.db().collection('items-of-interest');
            collection.find({}).toArray((err, result) => {
                if (err) {
                    database.close();
                    throw err;
                }

                resolve((result || [])
                    .map(item => ({
                        id: item.id,
                        createdOn: item.createdOn,
                        title: item.title,
                        navigationId: item.navigationId,
                        typeOfItem: item.typeOfItem,
                        description: item.description,
                        links: item.links,
                        address: item.address,
                        images: item.images
                    })));
                database.close();
            });
        })
        .catch(error => {
            reject(error);
        });
});
