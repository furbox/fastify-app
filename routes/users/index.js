'use strict';

const { userCtrl } = require('../../modules/user/user.ctrl');

module.exports = async function (fastify, opts) {
    fastify.get('/:id', userCtrl.getUserById);
    fastify.get('/', userCtrl.getAllUsers);
    fastify.post('/', userCtrl.addUser);
    fastify.delete('/:id', userCtrl.deleteUser);
    fastify.put('/:id', userCtrl.updateUser);
}