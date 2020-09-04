const fastify = require('fastify')({
    logger: true
});

fastify.get('/information-item', async (request, reply) => {
    reply.type('application/json').code(200);
    reply.send({});
})

fastify.listen(3002, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
