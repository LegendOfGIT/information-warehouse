const mongoClient = require('mongodb').MongoClient;
const requestModule = require('request');
const queryInformationRepository = require('./queryInformationRepository');

module.exports = (informationItemScoring) => new Promise((resolve, reject) => {
    if (!informationItemScoring?.itemId) {
        console.log('required itemId is missing');
        reject();
        return;
    }

    const searchProfileId = informationItemScoring?.searchProfileId;
    if (!searchProfileId) {
        console.log('required searchProfileId is missing');
        reject();
        return;
    }

    if (!informationItemScoring?.interest) {
        console.log('required interest is missing');
        reject();
        return;
    }

    mongoClient.connect('mongodb://localhost:27017/information-items')
        .then((database) => {
            const collection = database.db().collection('items');

            collection.findOne({ itemId: informationItemScoring.itemId })
                .then(informationItem => {
                    const navigationId = informationItem.navigationPath && informationItem.navigationPath.length ? informationItem.navigationPath[1] : '';
                    const modelId = navigationId ? `${searchProfileId}-${navigationId}` : '';
                    if (modelId && informationItemScoring.interest > 0) {
                        collection.aggregate([ { $match: { navigationPath: informationItem.navigationPath } },  { $sample: { size: 9 }} ])
                            .toArray(
                                (error, samples) => {
                                    if (null != error) {
                                        reject();
                                    }

                                    requestModule.post({
                                        url: 'http://localhost:3003/api/training-data?navigationId=' + navigationId + '&modelId=' + modelId,
                                        json: [{...informationItem, interest: informationItemScoring.interest }].concat(samples)
                                    }, () => {}, () => {});

                                    resolve();
                                }
                            );
                    }
                    else {
                        resolve();
                    }
                })
                .catch(error => {
                    reject(error);
                });
        })
        .catch(error => { reject(error); });
});
