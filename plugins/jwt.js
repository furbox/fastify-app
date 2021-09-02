'use strict'

const fp = require('fastify-plugin')

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {
    fastify.register(require('fastify-jwt'), {
        secret: 'supersecret'
    })

    fastify.decorate("authenticate", async function(request, reply) {
        try {
          await request.jwtVerify()
        } catch (err) {
          reply.send(err)
        }
      })
})
