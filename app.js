'use strict'

const path = require('path');
const AutoLoad = require('fastify-autoload');
const mongoose = require('mongoose');
const { createRolesInit } = require('./modules/role/role.ctrl');
const Fastify = require('fastify');
const { createModulesInit } = require('./modules/module/module.ctrl');
const { createPermissionsInit } = require('./modules/permission/permission.ctrl');
const { createUserInit } = require('./modules/user/user.ctrl');
const { format } = require('./helpers/response');

const fastify = Fastify({
  logger: {
    pinoPretty: true
  }
});
try {
  mongoose.connect(process.env.MONGODB_CNN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {
  console.error('Mongo Connection error: ', error);
}

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({ prefix: '/api/v1' }, opts)
  })

  fastify.setErrorHandler((error, request, reply) => {
    if (error.validation && error.validation.length > 0) {
      const path = error.validation[0].dataPath;
      const field = path.charAt(1).toUpperCase() + path.slice(2);
      const message = `${field} ${error.validation[0].message}`;
      reply.status(422).send(format(request, reply, message));
    }
  });

  await createModulesInit();
  await createPermissionsInit();
  await createRolesInit();
  await createUserInit();
  fastify.listen(5000);
}
