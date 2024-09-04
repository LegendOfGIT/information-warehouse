const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const removeCampaignParametersFromUrl = require('../../configuration/campaign-configuration').removeCampaignParametersFromUrl;

module.exports = ({ wishlistId, id, userId, url, title, titleImage, description, itemWasBought }) => new Promise((resolve, reject) => {
    id = id ?? crypto.randomUUID();
    description = description ?? '';
    title = title ?? '';
    titleImage = titleImage ?? '';
    itemWasBought = itemWasBought ?? false;

    let message = '';
    if (!userId) {
        message = 'required userId is missing';
        console.log(message);
        reject(message);
        return;
    }

    if (!wishlistId) {
        message = 'required wishlistId is missing';
        console.log(message);
        reject(message);
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then((database) => {
            const collection = database.db().collection('wishlists');
            collection.updateOne(
                { id: wishlistId, userId },
                {
                    $push: {
                        items: {
                            id,
                            url: removeCampaignParametersFromUrl(url),
                            title,
                            titleImage,
                            description,
                            itemWasBought,
                            lastUpdatedOn: new Date()
                        }
                    },
                    $set: {
                        userId,
                        lastUpdatedOn: new Date()
                    }
                },
                { upsert: true }
            )
                .then(response => {
                    resolve(response);
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
