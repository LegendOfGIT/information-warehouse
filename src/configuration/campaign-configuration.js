module.exports = {
    getCampaignParameterByUrl: (url) => {
        const mapping = {
            'amazon\.de': '?tag=wewannashop-21'
        };

        const foundCampaignIds = Object.keys(mapping).filter(urlPart => -1 !== url.indexOf(urlPart));
        if (foundCampaignIds && foundCampaignIds.length) {
            return mapping[foundCampaignIds[0]];
        }

        return '';
    }
};
