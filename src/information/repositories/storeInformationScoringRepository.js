const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;
const queryInformationRepository = require('./queryInformationRepository');
const storeInformationRepository = require('./storeInformationRepository');

const increaseScoringValue = (itemToScoreArguments, itemToScore, itemToCompare) => {
    const tags = itemToScore.tags || [];
    const matchingTags = (itemToCompare.tags || []).filter(tag => -1 !== tags.indexOf(tag));

    const matchingTagsInPercent = Math.ceil((matchingTags.length * 100) / tags.length);
    const scoring = itemToCompare.scoring || {};
    scoring[itemToScoreArguments.searchProfileId] = scoring[itemToScoreArguments.searchProfileId] || 0;
    scoring[itemToScoreArguments.searchProfileId] += (matchingTagsInPercent * itemToScoreArguments.scoring);
    itemToCompare.scoring = scoring;
}

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

    const itemsToScore = await queryInformationRepository({itemId: informationItemScoring.itemId}, false, 1, 1);
    const itemToScore = itemsToScore && itemsToScore.length ? itemsToScore[0] : undefined;
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

    increaseScoringValue(informationItemScoring, itemToScore, itemToScore);

    const deepestNavigationId = itemToScore.navigationPath[itemToScore.navigationPath.length - 1];
    const furtherItemsToScore = await queryInformationRepository(
        {
            itemId: { $ne: informationItemScoring.itemId },
            navigationPath: deepestNavigationId,
            tags: { $exists: true }
        },
        true,
        20,
        1);

    furtherItemsToScore.forEach(item => {
        increaseScoringValue(informationItemScoring, itemToScore, item);
        console.log(item.scoring);
    })


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
