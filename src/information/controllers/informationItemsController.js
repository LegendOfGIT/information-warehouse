const queryInformationItems = require('../queryInformationItems');
const storeInformationItem = require('../storeInformationItem');

const HTTP_STATUS_CODE_INTERNAL_ERROR = 500;
const HTTP_STATUS_CODE_OK = 200;

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {

    reply.code(HTTP_STATUS_CODE_INTERNAL_ERROR);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));

};

module.exports = () => ({
    registerGetInformationItems: (fastify) => {
        fastify.get('/api/information-items', async(request, reply) => {
            reply.type('application/json').code(200);

            const { navigationId, searchPattern } = request.query;

            const query = {};
            if (searchPattern) {
                query.title = new RegExp(`.*${searchPattern}.*`, 'i')
            }

            if (navigationId) {
                query.navigationPath = navigationId;

                const categoryId = observeConfiguration.getCategoryIdByNavigationId(navigationId);
                requestModule.post({
                    url: 'http://localhost:3001/observe-category',
                    json: { 'category-id': categoryId }
                }, () => {});
            }

            queryInformationItems(query)
                .then(response => {
                    reply.send({ errorMessage: '', items: response });
                })
                .catch(error => replyWithInternalError(reply, error, { items: [] }));
        });
    },

    registerStoreInformationItem: (fastify) => {
        fastify.put('/api/information-item', async (request, reply) => {
            reply.type('application/json').code(200);

            storeInformationItem(request.body)
                .then(() => {
                    reply.send({});
                })
                .catch(error => replyWithInternalError(reply, error));
        });
    }

});
