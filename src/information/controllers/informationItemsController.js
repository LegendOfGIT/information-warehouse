const requestModule = require('request');
const cron = require('node-cron');
const configuration = require('../../configuration/app-config')();
const queryInformationItems = require('../queryInformationItems');
const storeInformationItem = require('../storeInformationItem');
const storeInformationItemRepository = require('../repositories/storeInformationRepository');
const storeInformationItemScoring = require('../repositories/storeInformationScoringRepository');
const observeConfiguration = require('../../configuration/observe-configuration');
const ObjectID = require('mongodb').ObjectID;
const storeActivityVisitedCategoryRepository = require('../../activities/repositories/storeActivityVisitedCategoryRepository');
const updateItemsRepository = require('../../activities/repositories/updateItemsRepository');
const isOverviewRequest = require('../../request/isOverviewRequest');
const getAvailablePages = require('../getAvailablePages');

const HTTP_STATUS_CODE_INTERNAL_ERROR = 500;
const HTTP_STATUS_CODE_OK = 200;

cron.schedule('0 */3 * * *',
    () => {
        observeConfiguration.getRandomCategoryIds().forEach(categoryId => observeCategory(categoryId));
        observeConfiguration.getRandomCategoryIds().forEach(categoryId => observeCategory(categoryId));
    }
);

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {
    reply.code(HTTP_STATUS_CODE_INTERNAL_ERROR);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));
};

const observeCategory = (categoryId) => {
    requestModule.post({
        url: `http://${configuration.services.satelliteController.host}:3001/observe-category`,
        json: { 'category-id': categoryId }
    }, () => {});
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

module.exports = () => ({
    registerGetInformationItems: (fastify) => {
        fastify.get('/api/information-items', async(request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            const {
                id,
                highlightedItems,
                hashtags,
                navigationId,
                numberOfResults,
                page,
                randomItems,
                searchPattern,
                searchProfileId
            } = request.query;

            const query = {};

            if (id) {
                query._id = ObjectID(id);
            }

            if (highlightedItems) {
                query.isHighlighted = true;
            }

            if (searchPattern) {
                query['$or'] = [
                  { title: new RegExp(`.*${searchPattern}.*`, 'i') },
                  { description: new RegExp(`.*${searchPattern}.*`, 'i') }
                ];
            }

            const firstHashtag = getFirstHashtag(hashtags) || searchProfileId;
            if (navigationId) {
                query.navigationPath = navigationId;

                if (isOverviewRequest(id, firstHashtag, numberOfResults) && !isBotRequest(request)) {
                    observeConfiguration.getCategoryIdsByNavigationId(navigationId)
                        .forEach(categoryId => observeCategory(categoryId));
                }
            }

            await queryInformationItems(query, firstHashtag, randomItems, numberOfResults, page, true)
                .then(async response => {
                    const navigationIdOfFirstItem = response.length ? response[0].navigationPath[0] : '';
                    storeActivityVisitedCategoryRepository(
                        firstHashtag,
                        navigationIdOfFirstItem,
                        numberOfResults,
                        isBotRequest(request)
                    ).then(() => {
                    });

                    updateItemsRepository(response, firstHashtag, numberOfResults)
                        .then(() => {});

                    const availablePages = await getAvailablePages(query, numberOfResults, page);

                    if (!randomItems) {
                        reply.headers({
                            'Cache-Control': 'max-age=300'});
                    }

                    reply.send({
                        errorMessage: '',
                        items: response,
                        availablePages
                    });
                })
                .catch(error => replyWithInternalError(reply, error, { items: [] }));
        });
    },
    registerGetSampleInformationItemsOfCategories: (fastify) => {
        fastify.get('/api/information-items/by-categories', async(request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            const {
                navigationIds,
                numberOfResults,
                randomItems
            } = request.query;

            if (!navigationIds || !navigationIds.split(',').length) {
                reply.send({});
                return;
            }

            const resultItems = []
            await Promise.all(navigationIds.split(',').map(async navigationId => {
                const items = await queryInformationItems(
                    {navigationPath: navigationId},
                    undefined,
                    randomItems,
                    numberOfResults,
                    true);

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

    registerHighlightInformationItem: (fastify) => {
        fastify.put('/api/highlight-item', async (request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            const items = await queryInformationItems(
                { _id: ObjectID(request.body.id || '') },
                undefined,
                false,
                undefined,
                false);

            const item = items && items.length ? items[0] : undefined;

            if (!item) {
                reply.send({ errorMessage: 'item not found' });
                return;
            }

            item.isHighlighted = true;

            await storeInformationItemRepository(item)
                .then(() => {
                    reply.send({});
                })
                .catch(error => replyWithInternalError(reply, error));
        });
    },
    registerUnhighlightInformationItem: (fastify) => {
        fastify.delete('/api/highlight-item', async (request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            const items = await queryInformationItems(
                { _id: ObjectID(request.body.id || '') },
                undefined,
                false,
                undefined,
                false);

            const item = items && items.length ? items[0] : undefined;

            if (!item) {
                reply.send({ errorMessage: 'item not found' });
                return;
            }

            item.isHighlighted = false;

            await storeInformationItemRepository(item)
                .then(() => {
                    reply.send({});
                })
                .catch(error => replyWithInternalError(reply, error));
        });
    },

    registerStoreInformationItemScoring: (fastify) => {
        fastify.put('/api/information-item/scoring', async (request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            await storeInformationItemScoring(request.body)
                .then(async () => {
                    reply.send({});
                })
                .catch(error => replyWithInternalError(reply, error));
        });
    }
});
