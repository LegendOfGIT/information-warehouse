const requestModule = require('request');

const queryInformation = require('./repositories/queryInformationRepository')

module.exports = (query, searchProfileId) => new Promise((resolve, reject) => {
    queryInformation(query).then((items) => {
        const informationItem = items && items.length ? items[0] : {};
        const navigationId = informationItem.navigationPath && informationItem.navigationPath.length ? informationItem.navigationPath[1] : '';
        const modelId = navigationId ? `${searchProfileId}-${navigationId}` : '';
        console.log('modelId:' + modelId);
        if (modelId) {
            requestModule.post(
                'http://localhost:3003/api/give-predictions?navigationId=' + navigationId + '&modelId=' + modelId,
                { json: items },
                (err, res, itemsWithPredictions) => {
                    resolve(err ? items : itemsWithPredictions);
                }
            );
        }
        else { resolve(items); }
    }).catch((error) => { reject(error); })
});
