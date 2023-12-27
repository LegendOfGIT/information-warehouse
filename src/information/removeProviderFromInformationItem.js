const queryInformation = require('./repositories/queryInformationRepository');
const storeInformationItem = require('./storeInformationItem');

module.exports = (parameters) => new Promise((resolve, reject) => {
    const {
        mean
    } = parameters;

    const meanTokens = (mean || '').split('.');
    if (meanTokens.length <= 1) {
        resolve();
        return;
    }

    const query = { 'providers.mean': mean };

    queryInformation({
        query,
        numberOfResults: 1
    }).then((items) => {
        items = (items || []).filter(item => item['title-image']).map(item => {
            const providerMeanId = meanTokens[0];
            item.providers = item.providers.filter(provider => !(provider.mean || '').startsWith(providerMeanId));

            storeInformationItem(item).then(() => {});

            return item;
        });

        resolve(items);
    }).catch((error) => { reject(error); })
});
