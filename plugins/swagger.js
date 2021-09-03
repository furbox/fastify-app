'use strict'

const fp = require('fastify-plugin')

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {

    fastify.register(require('fastify-swagger'), {
        exposeRoute: true,
        routePrefix: '/docs',
        swagger: {
            info: { title: 'fastify-api' },
        },
    })
})



