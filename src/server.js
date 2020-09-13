const fastify = require('fastify')({
    logger: true
});

const storeInformationRepository = require('./storeInformationRepository');

fastify.put('/information-item', async (request, reply) => {
    storeInformationRepository(request.body);

    reply.type('application/json').code(200);
    reply.send({});
})

fastify.listen(3002, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
