const getCampaignParameterByUrl = require('../configuration/campaign-configuration').getCampaignParameterByUrl;
const queryInformation = require('./repositories/queryInformationRepository');

module.exports = (query) => new Promise((resolve, reject) => {
    queryInformation(query).then((items) => {
        items = (items || []).map(item => {
            (item.providers || []).forEach(provider => {
                provider.link = `${provider.link}${getCampaignParameterByUrl(provider.link)}`;
            });

            return item;
        });

        resolve(items);
    }).catch((error) => { reject(error); })
});