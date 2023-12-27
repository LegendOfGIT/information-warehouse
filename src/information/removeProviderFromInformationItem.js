const queryInformation = require('./repositories/queryInformationRepository');

module.exports = (parameters) => new Promise((resolve, reject) => {
    const {
        mean
    } = parameters;

    const meanTokens = (mean || '').split('.');
    if (meanTokens.length <= 1) {
        resolve();
        return;
    }

    const query = { 'provider.mean': mean };

    queryInformation({
        query,
        numberOfResults: 1
    }).then((items) => {
        items = (items || []).filter(item => item['title-image']).map(item => {
            const providerMeanId = meanTokens[0];
            console.log(item);
            item.providers = item.providers.filter(provider => !(provider.mean || '').startsWith(providerMeanId));
            console.log(item);

            return item;
        });

        resolve(items);
    }).catch((error) => { reject(error); })
});
