module.exports = {
    getCampaignParameterByUrl: (url) => {
        const mapping = {
            'amazon\.de': 'tag=wewannashop08-21'
        };

        const foundCampaignIds = Object.keys(mapping).filter(urlPart => -1 !== url.indexOf(urlPart));
        if (foundCampaignIds && foundCampaignIds.length) {
            return `${-1 !== (url || '').indexOf('?') ? '&' : '?'}${mapping[foundCampaignIds[0]]}`;
        }

        return '';
    },
    removeCampaignParametersFromUrl: (url) => {
        return url.replace(/tag=.*?&/, "").replace(/tag=.*$/, "").replace(/\?$/, "");
    }
};
