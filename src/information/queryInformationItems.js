const getCampaignParameterByUrl = require('../configuration/campaign-configuration').getCampaignParameterByUrl;
const queryInformation = require('./repositories/queryInformationRepository');
const filterConfiguration = require('../configuration/filter-configuration');
const constants = require('../constants');

module.exports = (query, hashtag, randomItems, numberOfResults, page, addCampaignParameter, filterIds = []) => new Promise((resolve, reject) => {
    filterIds = filterConfiguration.getDefaultFilterIdsBy(
        filterIds,
        query.navigationPath || '',
        numberOfResults,
        randomItems);

    console.log(filterIds);

    queryInformation(
        query,
        hashtag,
        randomItems,
        numberOfResults ? Number.parseInt(numberOfResults) : constants.DEFAULT_MAXIMUM_AMOUNT_OF_RESULTS,
        page,
        filterIds
    ).then((items) => {
        items = (items || []).filter(item => item['title-image']).map(item => {
            (item.providers || []).forEach(provider => {
                provider.link = addCampaignParameter ?
                    provider.link ? `${provider.link}${getCampaignParameterByUrl(provider.link)}` : '' :
                    provider.link;
            });

            //delete item.filterInformation;
            delete item.tags;
            delete item.titleWithoutSpecials;

            return item;
        });

        resolve(items);
    }).catch((error) => { reject(error); })
});