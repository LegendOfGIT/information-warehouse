const getSearchSuggestionsRankedByRequestsRepository = require("./repositories/getSearchSuggestionsRankedByRequestsRepository");

module.exports = (navigationPath, searchPattern) => new Promise((resolve) => {
    getSearchSuggestionsRankedByRequestsRepository(navigationPath, searchPattern)
        .then(rankedSuggestions => resolve({ rankedSuggestions: rankedSuggestions.map(item => item.suggestion) }))
        .catch(() => resolve({ rankedSuggestions: []}));
});
