const queryInformationRepository = require('../../information/repositories/queryInformationRepository');
const getWishlistItemsRepository = require('../repositories/getWishlistItemsRepository');
const storeWishlistItemsRepository = require('../repositories/storeWishlistItemsRepository');
const storeWishlist = require('../repositories/storeWishlistRepository');
const storeWishlistItem = require('../repositories/storeWishlistItemRepository');
const updateWishlistItem = require('../repositories/updateWishlistItemRepository');
const removeWishlistItem = require('../repositories/removeWishlistItemRepository');
const getWishlists = require('../repositories/getWishlistsRepository');
const deleteWishlist = require('../repositories/deleteWishlistRepository');
const shareWishlist = require('../repositories/shareWishlistRepository');
const updateWishlistItemWasBought = require('../repositories/updateWishlistItemWasBoughtRepository');
const discoverWishlistItem = require('../repositories/discoverWishlistItem');

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
    },

    registerCreateOrUpdateWishlist: (fastify) => {
        fastify.post('/api/wishlist', async (request, reply) => {
            reply.type('application/json');

            const { userId, id, title, description, imageId } = request.body;

            await storeWishlist({ id, userId, title, description, imageId }).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerGetWishlists: (fastify) => {
        fastify.get('/api/wishlists', async (request, reply) => {
            reply.type('application/json');

            const { userId } = request.query;

            await getWishlists({ userId }).then(async (wishlists) => {
                reply.code(HTTP_STATUS_CODE_OK).send(wishlists);
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerGetSingleWishlist: (fastify) => {
        fastify.get('/api/wishlist', async (request, reply) => {
            reply.type('application/json');

            const { userId, id, sharedWithHash } = request.query;

            await getWishlists({ userId, id, sharedWithHash }).then(async (wishlists) => {
                reply.code(HTTP_STATUS_CODE_OK).send(wishlists.length ? wishlists[0] : {});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerAddSingleWishlistItem: (fastify) => {
        fastify.put('/api/wishlist/item', async (request, reply) => {
            reply.type('application/json');

            const { userId, id, wishlistId, url, title, titleImage, description, itemWasBought } = request.body;

            await storeWishlistItem({ wishlistId, id, userId, url, title, titleImage, description, itemWasBought }).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerDiscoverWishlistItemAndAddItToWishlist: (fastify) => {
        fastify.post('/api/wishlist/item/discover-and-add', async (request, reply) => {
            reply.type('application/json');

            const { userId, wishlistId, url } = request.body;

            const item = await discoverWishlistItem({ url });
            const { title, titleImage, description } = item;

            await storeWishlistItem({ wishlistId, userId, url, title, titleImage, description }).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send(item);
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerUpdateSingleWishlistItem: (fastify) => {
        fastify.post('/api/wishlist/item', async (request, reply) => {
            reply.type('application/json');

            const { userId, wishlistId, itemId, url, title, titleImage, description, itemWasBought } = request.body;

            await updateWishlistItem({ wishlistId, itemId, userId, url, title, titleImage, description, itemWasBought }).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerRemoveSingleWishlistItem: (fastify) => {
        fastify.delete('/api/wishlist/item', async (request, reply) => {
            reply.type('application/json');

            const { userId, wishlistId, itemId } = request.body;

            await removeWishlistItem({ wishlistId, itemId, userId }).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerDeleteWishlist: (fastify) => {
        fastify.delete('/api/wishlist', async (request, reply) => {
            reply.type('application/json');

            const { userId, id } = request.body;

            await deleteWishlist({ id, userId }).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerShareWishlist: (fastify) => {
        fastify.post('/api/wishlist/share', async (request, reply) => {
            reply.type('application/json');

            const { userId, id, sharedWithHash } = request.body;

            await shareWishlist({ userId, id, sharedWithHash, isShareRequest: true }).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerCancelShareWishlist: (fastify) => {
        fastify.post('/api/wishlist/cancel-share', async (request, reply) => {
            reply.type('application/json');

            const { userId, id } = request.body;

            await shareWishlist({ userId, id, sharedWithHash: '', isShareRequest: false }).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerUpdateSingleWishlistItemWasBought: (fastify) => {
        fastify.post('/api/wishlist/item/bought', async (request, reply) => {
            reply.type('application/json');

            const { userId, wishlistId, itemId, itemWasBought } = request.body;

            await updateWishlistItemWasBought({ wishlistId, itemId, userId, itemWasBought }).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    }
});
