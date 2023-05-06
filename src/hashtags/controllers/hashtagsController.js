const getCategoriesRankedByRequestsRepository = require("../../profiles/repositories/getCategoriesRankedByRequestsRepository");

const HTTP_STATUS_CODE_OK = 200;

const getFirstHashtag = (hashtags) => {
    if (!hashtags) {
        return;
    }

    return hashtags.split(',')[0] || '';
}

module.exports = () => ({

    registerGetRankedCategoriesByHashTags: (fastify) => {
        fastify.get('/api/ranked-categories', async (request, reply) => {
            const { hashtags } = request.query;

            await getCategoriesRankedByRequestsRepository(getFirstHashtag(hashtags))
                .then(rankedCategories => reply.code(HTTP_STATUS_CODE_OK).send(rankedCategories))
                .catch(() => reply.code(HTTP_STATUS_CODE_OK).send([]));
        });
    }

});
