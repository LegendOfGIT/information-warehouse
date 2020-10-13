const fastify = require('fastify')({
    logger: true
});

const queryInformationRepository = require('./queryInformationRepository');
const removeInformationRepository = require('./removeInformationRepository');
const storeInformationRepository = require('./storeInformationRepository');

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
})

fastify.listen(3002, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
