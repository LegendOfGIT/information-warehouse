const getCategoriesRankedByRequestsRepository = require('./repositories/getCategoriesRankedByRequestsRepository');

module.exports = (searchProfileId) => new Promise((resolve, reject) => {
    getCategoriesRankedByRequestsRepository(searchProfileId)
        .then(rankedCategories => resolve({ rankedCategoryIds: rankedCategories.map(category => category.categoryId) }))
        .catch(() => resolve([]));
});