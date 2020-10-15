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
    reply.header('Access-Control-Allow-Origin', '*').send({ userId: uuid() });
});

fastify.get('/information-items', async(request, reply) => {
    reply.type('application/json').code(200);

    queryInformationRepository(request.query.searchPattern, request.query.navigationId)
        .then(response => {
            reply.header('Access-Control-Allow-Origin', '*').send({ errorMessage: '', items: response });
        })
        .catch(error => { reply.code(500).send({ errorMessage: error, items: [] }); });
});
fastify.post('/information-item', async (request, reply) => {
    reply.type('application/json').code(200);

    storeInformationRepository(request.body)
        .then(() => { reply.send({}); })
        .catch(error => reply.code(500).send({ errorMessage: error }));
})
fastify.put('/information-item', async (request, reply) => {
    reply.type('application/json').code(200);

    removeInformationRepository(request.body)
        .then(() => {
            storeInformationRepository(request.body)
                .then(() => { reply.send({}); })
                .catch(error => reply.code(500).send({ errorMessage: error }));
        })
        .catch(error => reply.code(500).send({ errorMessage: error }));
});

fastify.put('/wishlist-item', async (request, reply) => {
    reply.type('application/json');

    const { itemId, userId } = request.body;

    getWishlistItemsRepository(userId).then((items) => {
        console.log(items);
        items.push(itemId);

        removeWishlistRepository(userId)
            .then(() => {
                reply.code(200).send({ errorMessage: '' });

                storeWishlistItemsRepository(userId, items)
                    .then(() => { reply.code(200).send({}); })
                    .catch(error => reply.code(500).send({ errorMessage: error }));
            })
            .catch(error => { reply.code(500).send({ errorMessage: error }); });
    }).catch((error) => { reply.code(500).send({ errorMessage: error }); });
});

fastify.listen(3002, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
