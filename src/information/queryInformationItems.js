const getCampaignParameterByUrl = require('../configuration/campaign-configuration').getCampaignParameterByUrl;
const queryInformation = require('./repositories/queryInformationRepository');

module.exports = (query, numberOfResults) => new Promise((resolve, reject) => {
    queryInformation(query, numberOfResults ? Number.parseInt(numberOfResults) : 0).then((items) => {
        items = (items || []).filter(item => item['title-image']).map(item => {
            (item.providers || []).forEach(provider => {
                provider.link = `${provider.link}${getCampaignParameterByUrl(provider.link)}`;
            });

            return item;
        });

        resolve(items);
    }).catch((error) => { reject(error); })
});