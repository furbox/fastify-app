'use strict'

const fp = require('fastify-plugin')
const { getUserById } = require('../modules/user/user.ctrl')

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {

  const myCustomMessages = {
    badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
    noAuthorizationInHeaderMessage: 'Autorization header is missing!',
    authorizationTokenExpiredMessage: 'Authorization token expired',
    // for the below message you can pass a sync function that must return a string as shown or a string
    authorizationTokenInvalid: (err) => {
      return `Authorization token is invalid: ${err.message}`
    }
  }
  fastify.register(require('fastify-jwt'), {
    secret: process.env.JWT_SECRETKEY,
    messages: myCustomMessages
  })

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      const info = await request.jwtVerify();
      await getUserById(info.user.user_id, reply);
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.decorate("authPermission", (perms) => async function (request, reply) {
    try {
      console.log(perms)
      // const permissionList = typeof perms === 'string' ? perms.split(',').map(current => current.trim()) : perms;
      // const authorize = request.user.roles.some(current => permissionList.includes(current.name));
      // if (!authorize) {
      //   throw fastify.createError.MethodNotAllowed({ msg: 'youdonthavepermission'})
      // }
    } catch (err) {
      reply.send(err)
    }
  })
})
