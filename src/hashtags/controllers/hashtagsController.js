const getHashtagsRepository = require("../repositories/getHashtagsRepository");
const getCategoriesRankedByRequestsRepository = require("../../profiles/repositories/getCategoriesRankedByRequestsRepository");
const cache = require('../../cache/cache');

const HTTP_STATUS_CODE_OK = 200;

const getFirstHashtag = (hashtags) => {
    if (!hashtags) {
        return;
    }

    return hashtags.split(',')[0] || '';
}

module.exports = () => ({

    registerGetRankedCategoriesByHashtags: (fastify) => {
        fastify.get('/api/ranked-categories', async (request, reply) => {
            const { hashtags } = request.query;

            const firstHashtag = getFirstHashtag(hashtags);
            const cacheKey = `GRCBH||${firstHashtag}`;
            if (cache.has(cacheKey)) {
                reply.code(HTTP_STATUS_CODE_OK).send(cache.get(cacheKey));
                return;
            }

            await getCategoriesRankedByRequestsRepository(getFirstHashtag(hashtags))
                .then(rankedCategories => {
                    cache.set(cacheKey, rankedCategories, 18000);
                    reply.code(HTTP_STATUS_CODE_OK).send(rankedCategories);
                })
                .catch(() => reply.code(HTTP_STATUS_CODE_OK).send([]));
        });
    },

    registerGetHashtags: (fastify) => {
        fastify.get('/api/hashtags', async (request, reply) => {
            const { hashtagPattern } = request.query;

            await getHashtagsRepository(hashtagPattern || '')
                .then(hashtags => reply.code(HTTP_STATUS_CODE_OK).send(hashtags))
                .catch(() => reply.code(HTTP_STATUS_CODE_OK).send([]));
        });
    }
});
