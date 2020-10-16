const queryInformationRepository = require('./queryInformationRepository');
const removeInformationRepository = require('./removeInformationRepository');
const getWishlistItemsRepository = require('./wishlist/getWishlistItemsRepository');
const removeWishlistRepository = require('./wishlist/removeWishlistRepository');
const storeInformationRepository = require('./storeInformationRepository');
const storeWishlistItemsRepository = require('./wishlist/storeWishlistItemsRepository');
const uuid = require('uuid').v4;

const fastify = require('fastify')({
    logger: true
});

fastify.register(require('fastify-cors'), {});

fastify.get('/guest-user-id', async(request, reply) => {
    reply.type('application/json').code(200);
    reply.send({ userId: uuid() });
});

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {
    reply.code(500);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));
};

fastify.get('/information-items', async(request, reply) => {
    reply.type('application/json').code(200);

    const { navigationId, searchPattern } = request.query;

    const query = {};
    if (searchPattern) {
        query.title = new RegExp(`.*${searchPattern}.*`, 'i')
    }
    if (navigationId) {
        query.navigationPath = navigationId
    }

    queryInformationRepository(query)
        .then(response => {
            reply.send({ errorMessage: '', items: response });
        })
        .catch(error => replyWithInternalError(reply, error, { items: [] }));
});
fastify.post('/information-item', async (request, reply) => {
    reply.type('application/json').code(200);

    storeInformationRepository(request.body)
        .then(() => { reply.send({}); })
        .catch(error => replyWithInternalError(reply, error));
})
fastify.put('/information-item', async (request, reply) => {
    reply.type('application/json').code(200);

    removeInformationRepository(request.body)
        .then(() => {
            storeInformationRepository(request.body)
                .then(() => { reply.send({}); })
                .catch(error => reply.code(500).send({ errorMessage: error }));
        })
        .catch(error => replyWithInternalError(reply, error));
});

fastify.get('/wishlist-items', async (request, reply) => {
    reply.type('application/json');

    const { userId } = request.query;

    getWishlistItemsRepository(userId).then((items) => {
        queryInformationRepository({ itemId: { $in: items } }).then((informationItems) => {
            reply.code(200).send(informationItems);
        }).catch((error) => replyWithInternalError(reply, error));

    }).catch((error) => replyWithInternalError(reply, error));
});
fastify.delete('/wishlist-item', async (request, reply) => {
    reply.type('application/json');

    const { itemId, userId } = request.query;

    getWishlistItemsRepository(userId).then((items) => {
        items = items.filter((itemIdFromWishlist) => itemIdFromWishlist !== itemId);

        storeWishlistItemsRepository(userId, items)
            .then(() => { reply.code(200).send({}); })
            .catch(error => replyWithInternalError(reply, error));

    }).catch((error) => replyWithInternalError(reply, error));
});
fastify.put('/wishlist-item', async (request, reply) => {
    reply.type('application/json');

    const { itemId, userId } = request.body;

    getWishlistItemsRepository(userId).then((items) => {
        items.push(itemId);

        storeWishlistItemsRepository(userId, items)
            .then(() => { reply.code(200).send({}); })
            .catch(error => replyWithInternalError(reply, error));

    }).catch((error) => replyWithInternalError(reply, error));
});

fastify.listen(3002, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
