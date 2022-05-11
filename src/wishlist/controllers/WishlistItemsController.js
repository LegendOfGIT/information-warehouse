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
        fastify.get('/wishlist-items', async (request, reply) => {

            reply.type('application/json');

            const { userId } = request.query;

            getWishlistItemsRepository(userId).then((items) => {

                queryVirtualInformationItemsRepository({ itemId: { $in: items } }).then((informationItems) => {
                    reply.code(HTTP_STATUS_CODE_OK).send(informationItems);
                }).catch((error) => replyWithInternalError(reply, error));

            }).catch((error) => replyWithInternalError(reply, error));

        });
    },

    registerStoreWishlistItem: (fastify) => {
        fastify.put('/wishlist-item', async (request, reply) => {

            reply.type('application/json');

            const { itemId, userId } = request.body;

            console.log(userId);

            getWishlistItemsRepository(userId).then((items) => {
                console.log(items);
                items.push(itemId);
                console.log(itemId);
                console.log(items);

                storeWishlistItemsRepository(userId, items)
                    .then(() => { reply.code(HTTP_STATUS_CODE_OK).send({}); })
                    .catch(error => replyWithInternalError(reply, error));

            }).catch((error) => replyWithInternalError(reply, error));

        });
    },

    registerDeleteWishlistItem: (fastify) => {

        fastify.delete('/wishlist-item', async (request, reply) => {

            reply.type('application/json');

            const { itemId, userId } = request.query;

            getWishlistItemsRepository(userId).then((items) => {
                items = items.filter((itemIdFromWishlist) => itemIdFromWishlist !== itemId);

                storeWishlistItemsRepository(userId, items)
                    .then(() => { reply.code(HTTP_STATUS_CODE_OK).send({}); })
                    .catch(error => replyWithInternalError(reply, error));

            }).catch((error) => replyWithInternalError(reply, error));

        });

    }

});
