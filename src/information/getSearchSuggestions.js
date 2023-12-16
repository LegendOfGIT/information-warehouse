const getSearchSuggestionsRankedByRequestsRepository = require("./repositories/getSearchSuggestionsRankedByRequestsRepository");

module.exports = (navigationPath, searchPattern) => new Promise((resolve) => {
    getSearchSuggestionsRankedByRequestsRepository(navigationPath, searchPattern)
        .then(rankedSuggestions => resolve(rankedSuggestions.map(item => ({ suggestion: item.suggestion }))))
        .catch(() => resolve([]));
});
