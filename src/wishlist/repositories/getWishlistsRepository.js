const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const getCampaignParameterByUrl = require('../../configuration/campaign-configuration').getCampaignParameterByUrl;

module.exports = ({userId}) => new Promise((resolve, reject) => {
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection = database.db().collection('wishlists');

            collection.find({ userId }).toArray((err, result) => {
                if (err) {
                    database.close();
                    throw err;
                }

                (result ?? []).forEach((wishlist) => {
                    wishlist.items = (wishlist.items ?? []).map((item) => {
                        item.url = getCampaignParameterByUrl(item.url);
                        return item;
                    })
                });

                resolve(result);
                database.close();
            });
        })
        .catch(error => {
            reject(error);
        });
});
