const queryInformationCountRepository = require('./repositories/queryInformationCountRepository');
const constants = require('../constants');
const availablePageResolver = require('./resolver/availablePageResolver');

module.exports = (query, priceFrom, priceTo, numberOfResults, page, createdToday, filterIds) => new Promise((resolve, reject) => {

    queryInformationCountRepository(query, priceFrom, priceTo, numberOfResults, createdToday, filterIds)
        .then(resultCount => {
            page = page ? Number.parseInt(page) : 1;
            numberOfResults = numberOfResults ? Number.parseInt(numberOfResults) : constants.DEFAULT_MAXIMUM_AMOUNT_OF_RESULTS;

            resolve(availablePageResolver(resultCount, numberOfResults, page));
        })
        .catch(error => reject(error));
});
