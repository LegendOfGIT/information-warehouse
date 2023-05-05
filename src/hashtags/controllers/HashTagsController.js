const getCategoriesRankedByRequestsRepository = require("../../profiles/repositories/getCategoriesRankedByRequestsRepository");

const HTTP_STATUS_CODE_OK = 200;

const getFirstHashTag = (hashTags) => {
    if (!hashTags) {
        return;
    }

    return hashTags.split(',')[0] || '';
}

module.exports = () => ({

    registerGetRankedCategoriesByHashTags: (fastify) => {
        fastify.get('/api/ranked-categories', async (request, reply) => {
            const { hashTags } = request.query;

            await getCategoriesRankedByRequestsRepository(getFirstHashTag(hashTags))
                .then(rankedCategories => reply.code(HTTP_STATUS_CODE_OK).send(rankedCategories))
                .catch(() => reply.code(HTTP_STATUS_CODE_OK).send([]));
        });
    }

});
