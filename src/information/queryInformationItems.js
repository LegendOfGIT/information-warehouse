const getCampaignParameterByUrl = require('../configuration/campaign-configuration').getCampaignParameterByUrl;
const queryInformation = require('./repositories/queryInformationRepository');
const constants = require('../constants');

module.exports = (query, randomItems, numberOfResults, page) => new Promise((resolve, reject) => {
    queryInformation(
        query,
        randomItems,
        numberOfResults ? Number.parseInt(numberOfResults) : constants.DEFAULT_MAXIMUM_AMOUNT_OF_RESULTS,
        page
    ).then((items) => {
        items = (items || []).filter(item => item['title-image']).map(item => {
            (item.providers || []).forEach(provider => {
                provider.link = provider.link ? `${provider.link}${getCampaignParameterByUrl(provider.link)}` : '';
            });

            return item;
        });

        resolve(items);
    }).catch((error) => { reject(error); })
});