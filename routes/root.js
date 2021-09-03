'use strict'

module.exports = async function (fastify, opts) {
  //default route
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
}
