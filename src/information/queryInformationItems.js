const getCampaignParameterByUrl = require('../configuration/campaign-configuration').getCampaignParameterByUrl;
const queryInformation = require('./repositories/queryInformationRepository');

module.exports = (query, numberOfResults) => new Promise((resolve, reject) => {
    const MAXIMUM_AMOUNT_OF_RESULTS = 80;

    queryInformation(query, numberOfResults ? Number.parseInt(numberOfResults) : MAXIMUM_AMOUNT_OF_RESULTS).then((items) => {
        items = (items || []).filter(item => item['title-image']).map(item => {
            (item.providers || []).forEach(provider => {
                provider.link = `${provider.link}${getCampaignParameterByUrl(provider.link)}`;
            });

            return item;
        });

        resolve(items);
    }).catch((error) => { reject(error); })
});