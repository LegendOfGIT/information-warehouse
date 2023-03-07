const requestModule = require('request');
const cron = require('node-cron');
const configuration = require('../../configuration/app-config')();
const queryInformationItems = require('../queryInformationItems');
const storeInformationItem = require('../storeInformationItem');
const storeInformationItemScoring = require('../repositories/storeInformationScoringRepository');
const observeConfiguration = require('../../configuration/observe-configuration');
const ObjectID = require('mongodb').ObjectID;

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

module.exports = () => ({
    registerGetInformationItems: (fastify) => {
        fastify.get('/api/information-items', async(request, reply) => {
            reply.type('application/json').code(200);

            const { id, navigationId, numberOfResults, searchPattern, searchProfileId } = request.query;

            const query = {};

            if (id) {
                query._id = ObjectID(id);
            }

            if (searchPattern) {
                query.title = new RegExp(`.*${searchPattern}.*`, 'i')
            }

            if (navigationId) {
                query.navigationPath = navigationId;
                observeConfiguration.getCategoryIdsByNavigationId(navigationId).forEach(categoryId => observeCategory(categoryId));
            }

            await queryInformationItems(query, numberOfResults)
                .then(response => {
                    response = response.sort((a,b) => {
                        let scoringA = 0;
                        let scoringB = 0;

                        if (a.scoring) {
                            scoringA = a.scoring[searchProfileId || ''] || 0;
                        }
                        if (b.scoring) {
                            scoringB = b.scoring[searchProfileId || ''] || 0;
                        }

                        return scoringB - scoringA;
                    });

                    reply.send({ errorMessage: '', items: response });
                })
                .catch(error => replyWithInternalError(reply, error, { items: [] }));
        });
    },

    registerStoreInformationItem: (fastify) => {
        fastify.put('/api/information-item', async (request, reply) => {
            reply.type('application/json').code(200);

            await storeInformationItem(request.body)
                .then(() => {
                    reply.send({});
                })
                .catch(error => replyWithInternalError(reply, error));
        });
    },

    registerStoreInformationItemScoring: (fastify) => {
        fastify.put('/api/information-item/scoring', async (request, reply) => {
            reply.type('application/json').code(200);

            await storeInformationItemScoring(request.body)
                .then(async () => {
                    reply.send({});
                })
                .catch(error => replyWithInternalError(reply, error));
        });
    }

});
