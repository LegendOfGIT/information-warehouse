const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

const getRootCategoryIdFrom = (navigationId) => {
    let malformedCategoryBeginnings = ['BEAUTY_CARE', 'ELECTRONICS_AND_COMPUTERS'];
    for (let malformedCategoryBeginning of malformedCategoryBeginnings) {
        if ((navigationId || '') === malformedCategoryBeginning) {
            return malformedCategoryBeginning;
        }
    }

    const navigationIdTokens = (navigationId || '').split('_');
    return navigationIdTokens[0];
}

module.exports = (searchProfileId, navigationId, maximumNumberOfResults, isBotRequest) => new Promise((resolve) => {
    if (isBotRequest) {
        resolve();
        return;
    }

    if (undefined === searchProfileId) {
        resolve();
        return;
    }

    if (maximumNumberOfResults) {
        resolve();
        return;
    }

    const categoryId = getRootCategoryIdFrom(navigationId);
    if (!categoryId) {
        resolve();
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/activities`)
        .then((database) => {
            const collection = database.db().collection('visitedCategories');
            collection.insertOne({
                categoryId,
                searchProfileId,
                activityOn: new Date()
            })
                .then(response => {
                    resolve(response);
                })
                .catch(() => {
                    resolve();
                })
                .finally(() => {
                    database.close();
                });
        })
        .catch(() => { resolve(); });
});
