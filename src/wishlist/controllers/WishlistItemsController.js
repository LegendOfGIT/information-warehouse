const queryInformationRepository = require('../../information/repositories/queryInformationRepository');
const getWishlistItemsRepository = require('../repositories/getWishlistItemsRepository');
const storeWishlistItemsRepository = require('../repositories/storeWishlistItemsRepository');

const HTTP_STATUS_CODE_INTERNAL_ERROR = 500;
const HTTP_STATUS_CODE_OK = 200;

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {

    reply.code(HTTP_STATUS_CODE_INTERNAL_ERROR);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));

};

module.exports = () => ({

    registerGetWishlistItems: (fastify) => {
        fastify.get('/api/wishlist-items', async (request, reply) => {
            reply.type('application/json');

            const { userId } = request.query;

            await getWishlistItemsRepository(userId).then(async (items) => {
                await queryInformationRepository({
                    query: { itemId: { $in: items } },
                    randomItems: 'false'
                })
                    .then((informationItems) => {
                        reply.code(HTTP_STATUS_CODE_OK).send(informationItems);
                    }).catch((error) => replyWithInternalError(reply, error));

            }).catch((error) => replyWithInternalError(reply, error));
        });
    },

    registerStoreWishlistItem: (fastify) => {
        fastify.put('/api/wishlist-item', async (request, reply) => {
            reply.type('application/json');

            const { itemId, userId } = request.body;

            await getWishlistItemsRepository(userId).then(async (items) => {
                items.push(itemId);

                await storeWishlistItemsRepository(userId, items)
                    .then(async () => { reply.code(HTTP_STATUS_CODE_OK).send({}); })
                    .catch(error => replyWithInternalError(reply, error));

            }).catch((error) => replyWithInternalError(reply, error));
        });
    },

    registerDeleteWishlistItem: (fastify) => {
        fastify.delete('/api/wishlist-item', async (request, reply) => {
            reply.type('application/json');

            const { itemId, userId } = request.query;

            await getWishlistItemsRepository(userId).then(async (items) => {
                items = items.filter((itemIdFromWishlist) => itemIdFromWishlist !== itemId);

                await storeWishlistItemsRepository(userId, items)
                    .then(async () => { reply.code(HTTP_STATUS_CODE_OK).send({}); })
                    .catch(error => replyWithInternalError(reply, error));

            }).catch((error) => replyWithInternalError(reply, error));
        });
    }

});
