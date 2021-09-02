'use strict';


module.exports = async function (fastify, opts) {
    fastify.get('/', (_request, _reply) => {
        _reply.send({ msg: 'ok' });
    });
}