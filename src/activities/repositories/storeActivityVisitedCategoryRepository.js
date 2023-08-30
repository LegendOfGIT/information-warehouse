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

module.exports = (hashtag, navigationId, maximumNumberOfResults, isBotRequest) => new Promise((resolve) => {
    if (isBotRequest) {
        resolve();
        return;
    }

    if (undefined === hashtag) {
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

            const date2MonthAgo = new Date();
            date2MonthAgo.setMonth(date2MonthAgo.getMonth() - 1);

            collection.removeMany({ activityOn: { $lt: date2MonthAgo }}).then(() => {}).catch(() => {});

            collection.insertOne({
                categoryId,
                hashtag,
                searchProfileId: hashtag,
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
