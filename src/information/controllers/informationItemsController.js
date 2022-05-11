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
        fastify.get('/information-items', async(request, reply) => {

            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            const { navigationId, searchPattern } = request.query;

            const query = {};
            if (searchPattern) {
                query.title = new RegExp(`.*${searchPattern}.*`, 'i')
            }
            if (navigationId) {
                query.navigationPath = navigationId
            }

            queryInformationItems(query)
                .then(response => {
                    reply.send({ errorMessage: '', items: response });
                })
                .catch(error => replyWithInternalError(reply, error, { items: [] }));

        });
    },

    registerStoreInformationItem: (fastify) => {

        fastify.put('/information-item', async (request, reply) => {

            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            storeInformationItem(request.body)
                .then(() => {
                    reply.send({});
                })
                .catch(error => replyWithInternalError(reply, error));

        });

    }

});
