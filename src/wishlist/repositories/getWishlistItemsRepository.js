const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const getCampaignParameterByUrl = require('../../configuration/campaign-configuration').getCampaignParameterByUrl;

module.exports = (userId) => new Promise((resolve, reject) => {
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection = database.db().collection('wishlist-items');

            collection.findOne({ userId })
                .then((result) => {
                    resolve(result.items.map((item) => {
                        item.url = getCampaignParameterByUrl(item.url);
                        return item;
                    }));
                })
                .catch(() => {
                    resolve([]);
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(error => {
            reject(error);
        });
});
