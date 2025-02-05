const requestModule = require('axios');
const cron = require('node-cron');
const configuration = require('../../configuration/app-config')();
const queryInformationItems = require('../queryInformationItems');
const storeInformationItem = require('../storeInformationItem');
const storeInformationItemScoring = require('../repositories/storeInformationScoringRepository');
const observeConfiguration = require('../../configuration/observe-configuration');
const ObjectID = require('mongodb').ObjectID;
const storeActivityVisitedCategoryRepository = require('../../activities/repositories/storeActivityVisitedCategoryRepository');
const updateItemsRepository = require('../../activities/repositories/updateItemsRepository');
const isOverviewRequest = require('../../request/isOverviewRequest');
const getAvailablePages = require('../getAvailablePages');
const containsBadTerm = require('../validator/containsBadTerm');
const getAvailableFilters = require('../../filters/getAvailableFilters');
const cache = require('../../cache/cache');
const updateSingleItemRepository = require('../repositories/updateSingleItemRepository');
const getSearchSuggestions = require('../getSearchSuggestions');
const removeProviderFromInformationItem = require('../removeProviderFromInformationItem');

const HTTP_STATUS_CODE_INTERNAL_ERROR = 500;
const HTTP_STATUS_CODE_OK = 200;

cron.schedule('0 */3 * * *',
    async () => {
        let randomCategories = await observeConfiguration.getRandomCategoryIds();
        randomCategories.forEach(categoryId => observeCategory(categoryId));

        randomCategories = await observeConfiguration.getRandomCategoryIds();
        randomCategories.forEach(categoryId => observeCategory(categoryId));
    }
);

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {
    reply.code(HTTP_STATUS_CODE_INTERNAL_ERROR);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));
};

const observeCategory = (categoryId) => {
    requestModule.post(
        `http://${configuration.services.satelliteController.host}:3001/observe-category`,
        { 'category-id': categoryId }
    ).then(() => {}).catch(() => {});
};

const isBotRequest = (request) => {
    return 'true' === (request.query['isBot'] || 'false');
};

const getFirstHashtag = (hashtags) => {
    if (!hashtags) {
        return;
    }

    return hashtags.split(',')[0] || '';
}

const addSearchQuery = (query, searchPattern) => {
    if (!searchPattern) {
        return;
    }

    query.title = searchPattern;
};

const getGetInformationItemsCacheKey = (query,
                                        hashtag,
                                        randomItems,
                                        numberOfResults,
                                        page,
                                        priceFrom,
                                        priceTo,
                                        addCampaignParameter,
                                        filterIds,
                                        createdToday) => {
    if (randomItems || query._id) {
        return '';
    }

    return 'GET_INFORMATION_ITEMS||' + [
        query.title,
        query.navigationPath,
        hashtag,
        numberOfResults,
        page,
        filterIds.join(';;'),
        priceFrom,
        priceTo,
        addCampaignParameter,
        createdToday
    ].join('||');
};

module.exports = () => ({
    registerGetInformationItems: (fastify) => {
        fastify.get('/api/information-items', async(request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            const {
                id,
                createdToday,
                filters,
                highlightedItems,
                navigationId,
                numberOfResults,
                page,
                priceFrom,
                priceTo,
                randomItems,
                searchPattern,
                searchProfileId
            } = request.query;

            let { hashtags } = request.query;

            const query = {};

            if (id) {
                query._id = ObjectID(id);
            }

            if (highlightedItems) {
                query.isHighlighted = true;
            }

            addSearchQuery(query, searchPattern);

            const hashtagsContainBadTerm = containsBadTerm(hashtags);
            hashtags = hashtagsContainBadTerm ? 'Highlights' : hashtags;

            const firstHashtag = getFirstHashtag(hashtags) || searchProfileId;
            if (navigationId) {
                query.navigationPath = navigationId;

                if (isOverviewRequest(id, firstHashtag, numberOfResults) && !isBotRequest(request)) {
                    const categoryIds = await observeConfiguration.getCategoryIdsByNavigationId(navigationId);
                    categoryIds.forEach(categoryId => observeCategory(categoryId));
                }
            }

            const filterIds = (filters || '').split('-');
            const cacheKey = getGetInformationItemsCacheKey(
                query,
                firstHashtag,
                randomItems,
                numberOfResults,
                page,
                priceFrom,
                priceTo,
                true,
                filterIds,
                createdToday);

            if (cacheKey && cache.has(cacheKey)) {
                reply.send(cache.get(cacheKey));
                return
            }

            const botRequest = isBotRequest(request);
            await queryInformationItems({
                query,
                botRequest,
                createdToday,
                hashtag: firstHashtag,
                randomItems,
                numberOfResults,
                page,
                priceFrom,
                priceTo,
                addCampaignParameter: true,
                filterIds
            })
                .then(async response => {
                    const navigationIdOfFirstItem = response.length ? response[0].navigationPath[0] : '';
                    storeActivityVisitedCategoryRepository(
                        firstHashtag,
                        navigationIdOfFirstItem,
                        numberOfResults,
                        botRequest
                    ).then(() => {
                    });

                    updateItemsRepository(response, numberOfResults, botRequest)
                        .then(() => {});

                    const availablePages = await getAvailablePages(
                        query,
                        priceFrom,
                        priceTo,
                        numberOfResults,
                        page,
                        createdToday,
                        filterIds);

                    const res = {
                        errorCode: hashtagsContainBadTerm ? 'HASHTAGS_CONTAIN_BAD_TERM' : '',
                        items: response,
                        availablePages
                    };

                    if (!randomItems) {
                        reply.headers({'Cache-Control': 'max-age=600'});
                        if (cacheKey) { cache.set(cacheKey, res, 600); }
                    }

                    reply.send(res);
                })
                .catch(error => replyWithInternalError(reply, error, { items: [] }));
        });
    },
    registerGetSampleInformationItemsOfCategories: (fastify) => {
        fastify.get('/api/information-items/by-categories', async(request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            const {
                filters,
                navigationIds,
                numberOfResults,
                randomItems
            } = request.query;

            if (!navigationIds || !navigationIds.split(',').length) {
                reply.send({});
                return;
            }

            const resultItems = [];
            const filterIds = (filters || '').split('-');
            await Promise.all(navigationIds.split(',').map(async navigationId => {
                const items = await queryInformationItems({
                    query: {navigationPath: navigationId},
                    randomItems,
                    numberOfResults,
                    addCampaignParameter: false,
                    filterIds
                });

                resultItems.push(items && items.length ? items[0] : undefined);
            }))

            reply.send({ items: resultItems.filter(item => item) });
        });
    },
    registerStoreInformationItem: (fastify) => {
        fastify.put('/api/information-item', async (request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            await storeInformationItem(request.body)
                .then(() => {
                    reply.send({});
                })
                .catch(error => replyWithInternalError(reply, error));
        });
    },
    registerStoreInformationItemScoring: (fastify) => {
        fastify.put('/api/information-item/scoring', async (request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            if (containsBadTerm(request.body.hashtags)) {
                reply.send({ errorCode: 'HASHTAGS_CONTAIN_BAD_TERM' });
                return;
            }

            await storeInformationItemScoring(request.body)
                .then(async () => {
                    reply.send({});
                })
                .catch(error => replyWithInternalError(reply, error));
        });
    },
    registerGetAvailableFilters: (fastify) => {
        fastify.get('/api/available-filters', async(request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            const {
                navigationId,
                priceFrom,
                priceTo,
                searchPattern
            } = request.query;

            const query = {};

            addSearchQuery(query, searchPattern);

            if (navigationId) {
                query.navigationPath = navigationId;
            }

            await getAvailableFilters({ query, priceFrom, priceTo })
                .then(async response => {
                    reply.send({
                        errorCode: '',
                        items: response
                    });
                })
                .catch(error => replyWithInternalError(reply, error, { items: [] }));
        });
    },
    registerDiscoverItem: (fastify) => {
        fastify.get('/api/discover-item', async(request) => {
            const {
                itemId,
                navigationPath
            } = request.query;

            updateSingleItemRepository(
                itemId || '',
                (navigationPath || '').split(','),
                true);
        });
    },
    registerGetSearchSuggestions: (fastify) => {
        fastify.get('/api/search-suggestions', async(request, reply) => {
            const {
                navigationId,
                searchPattern
            } = request.query;

            await getSearchSuggestions(navigationId, searchPattern)
                .then(async response => {
                    reply.send({
                        errorCode: '',
                        items: response
                    });
                })
                .catch(error => replyWithInternalError(reply, error, { items: [] }));
        });
    },
    registerRemoveProvider: (fastify) => {
        fastify.delete('/api/information-item', async(request, reply) => {
            const {
                mean
            } = request.query;

            await removeProviderFromInformationItem({ mean })
                .then(async response => {
                    reply.send({
                        errorCode: '',
                        items: response
                    });
                })
                .catch(error => replyWithInternalError(reply, error, { items: [] }));
        });
    }
});
