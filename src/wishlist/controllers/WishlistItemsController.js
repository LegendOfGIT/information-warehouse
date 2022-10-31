const storeInformationItem = require('../../information/storeInformationItem');
const queryVirtualInformationItemsRepository = require('../../information/repositories/queryVirtualInformationItemsRepository');
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

            getWishlistItemsRepository(userId).then((items) => {
                queryVirtualInformationItemsRepository({ itemId: { $in: items } }).then((informationItems) => {
                    reply.code(200).send(informationItems);
                }).catch((error) => replyWithInternalError(reply, error));

            }).catch((error) => replyWithInternalError(reply, error));
        });
    },

    registerStoreWishlistItem: (fastify) => {
        fastify.put('/api/wishlist-item', async (request, reply) => {
            reply.type('application/json');

            const { itemId, userId } = request.body;

            getWishlistItemsRepository(userId).then((items) => {
                items.push(itemId);

                storeWishlistItemsRepository(userId, items)
                    .then(() => { reply.code(200).send({}); })
                    .catch(error => replyWithInternalError(reply, error));

            }).catch((error) => replyWithInternalError(reply, error));
        });
    },

    registerDeleteWishlistItem: (fastify) => {
        fastify.delete('/api/wishlist-item', async (request, reply) => {
            reply.type('application/json');

            const { itemId, userId } = request.query;

            getWishlistItemsRepository(userId).then((items) => {
                items = items.filter((itemIdFromWishlist) => itemIdFromWishlist !== itemId);

                storeWishlistItemsRepository(userId, items)
                    .then(() => { reply.code(200).send({}); })
                    .catch(error => replyWithInternalError(reply, error));

            }).catch((error) => replyWithInternalError(reply, error));
        });
    }

});
