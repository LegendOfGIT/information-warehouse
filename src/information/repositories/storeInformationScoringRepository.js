const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const queryInformationRepository = require('./queryInformationRepository');

module.exports = (informationItemScoring) => new Promise(async (resolve, reject) => {
    if (!informationItemScoring?.itemId) {
        console.log('required itemId is missing');
        reject();
        return;
    }

    if (!informationItemScoring?.scoring) {
        console.log('required scoring is missing');
        reject();
        return;
    }

    const itemToScore = await queryInformationRepository({itemId: informationItemScoring.itemId}, false, 1, 1);
    if (!itemToScore) {
        console.log('item to score can not be found');
        reject();
        return;
    }

    if (!(itemToScore.tags || []).length) {
        console.log('item to score has no tags for scoring');
        reject();
        return;
    }

    resolve();

    /*mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then((database) => {
            const collection = database.db().collection('items');

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
        .catch(error => { reject(error); });*/
});
