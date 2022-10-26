const requestModule = require('request');

const queryInformationItems = require('./information/queryInformationItems');
const queryInformationRepository = require('./information/repositories/queryInformationRepository');
const queryVirtualInformationItemsRepository = require('./information/repositories/queryVirtualInformationItemsRepository');
const getWishlistItemsRepository = require('./wishlist/getWishlistItemsRepository');
const storeWishlistItemsRepository = require('./wishlist/storeWishlistItemsRepository');
const storeInformationItem = require('./information/storeInformationItem');
const observeConfiguration = require('./configuration/observe-configuration');

const fastify = require('fastify')({
    logger: true
});

fastify.register(require('fastify-cors'), {});

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {
    reply.code(500);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));
};

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
fastify.put('/information-item', async (request, reply) => {
    reply.type('application/json').code(200);

    storeInformationItem(request.body)
        .then(() => {
            reply.send({});
        })
        .catch(error => replyWithInternalError(reply, error));
});

fastify.get('/api/wishlist-items', async (request, reply) => {
    reply.type('application/json');

    const { userId } = request.query;

    getWishlistItemsRepository(userId).then((items) => {
        queryVirtualInformationItemsRepository({ itemId: { $in: items } }).then((informationItems) => {
            reply.code(200).send(informationItems);
        }).catch((error) => replyWithInternalError(reply, error));

    }).catch((error) => replyWithInternalError(reply, error));
});
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

fastify.listen(3002, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
