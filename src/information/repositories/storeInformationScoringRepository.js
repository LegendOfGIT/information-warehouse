const mongoClient = require('mongodb').MongoClient;

module.exports = (informationItemScoring) => new Promise((resolve, reject) => {
    if (!informationItemScoring?.itemId) {
        console.log('required itemId is missing');
        reject();
        return;
    }

    if (!informationItemScoring?.searchProfileId) {
        console.log('required searchProfileId is missing');
        reject();
        return;
    }

    if (!informationItemScoring?.scoring) {
        console.log('required scoring is missing');
        reject();
        return;
    }

    mongoClient.connect('mongodb://localhost:27017/information-items')
        .then((database) => {
            const collection = database.db().collection('virtual-items');

            collection.findOne({ itemId: informationItemScoring.itemId })
                .then(informationItem => {

                    let { scoring } = informationItem;
                    scoring = scoring || {};

                    scoring[informationItemScoring.searchProfileId] = scoring[informationItemScoring.searchProfileId] || 0;
                    scoring[informationItemScoring.searchProfileId] += informationItemScoring.scoring;
                    informationItem.scoring = scoring;

                    collection.replaceOne(
                        { itemId: informationItem.itemId },
                        informationItem,
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
                .catch(error => {
                    reject(error);
                });
        })
        .catch(error => { reject(error); });
});
