const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const removeCampaignParametersFromUrl = require('../../configuration/campaign-configuration').removeCampaignParametersFromUrl;

module.exports = ({ wishlistId, itemId, userId, url, title, titleImage, description, itemWasBought }) => new Promise((resolve, reject) => {
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

    if (!itemId) {
        message = 'required itemId is missing';
        console.log(message);
        reject(message);
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/wishlists`)
        .then((database) => {
            const collection = database.db().collection('wishlists');

            collection.findOne({ id: wishlistId })
                .then((result) => {
                    const items = result.items;
                    const itemToUpdate = items.find((item) => item.id === itemId);
                    if (itemToUpdate) {
                        itemToUpdate.url = removeCampaignParametersFromUrl(url);
                        itemToUpdate.title = title;
                        itemToUpdate.titleImage = titleImage;
                        itemToUpdate.description = description;
                        itemToUpdate.itemWasBought = itemWasBought;
                        itemToUpdate.lastUpdatedOn = new Date();
                    }

                    collection.updateOne(
                        { id: wishlistId },
                        {
                            $set: {
                                items,
                                userId,
                                lastUpdatedOn: new Date()
                            }
                        },
                        { upsert: true }
                    )
                        .then(() => {
                            resolve();
                        })
                        .catch(error => {
                            reject(error);
                        })
                        .finally(() => {
                            database.close();
                        });
                })
                .catch((error) => {
                    reject(error);
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(error => { reject(error); });
});
