'use strict';

const { userCtrl } = require('../../modules/user/user.ctrl');

module.exports = async function (fastify, opts) {
    fastify.get('/:id', { preValidation: [fastify.authenticate]}, userCtrl.getUserById);
    fastify.get('/', { preValidation: [fastify.authenticate] }, userCtrl.getAllUsers);
    fastify.post('/', { preValidation: [fastify.authenticate] }, userCtrl.addUser);
    fastify.delete('/:id', { preValidation: [fastify.authenticate] }, userCtrl.deleteUser);
    fastify.put('/:id', { preValidation: [fastify.authenticate] }, userCtrl.updateUser);
}