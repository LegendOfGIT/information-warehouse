const getCategoriesRankedByRequestsRepository = require('./repositories/getCategoriesRankedByRequestsRepository');

module.exports = (hashtag) => new Promise((resolve) => {
    getCategoriesRankedByRequestsRepository(hashtag)
        .then(rankedCategories => resolve({ rankedCategoryIds: rankedCategories.map(category => category.categoryId) }))
        .catch(() => resolve({ rankedCategoryIds: []}));
});