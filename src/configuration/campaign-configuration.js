module.exports = {
    getCampaignParameterByUrl: (url) => {
        const mapping = {
            'amazon\.de': '?tag=wewannashop-21'
            //'shop24direct\.de': '?by=OxS24dDeAffZanox&utm_source=zanox&utm_medium=affiliate' should be handled by awin script
        };

        const foundCampaignIds = Object.keys(mapping).filter(urlPart => -1 !== url.indexOf(urlPart));
        if (foundCampaignIds && foundCampaignIds.length) {
            return mapping[foundCampaignIds[0]];
        }

        return '';
    }
};
