'use strict';

const PermissionsEnum = require('../../modules/permission/permission.enum');
const { userCtrl } = require('../../modules/user/user.ctrl');

module.exports = async function (fastify, opts) {
    fastify.get('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.USER.getUserById.namekey)] }, userCtrl.getUserById);
    fastify.get('/', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.USER.getAllUsers.namekey)] }, userCtrl.getAllUsers);
    fastify.post('/', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.USER.addUser.namekey)] }, userCtrl.addUser);
    fastify.delete('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.USER.deleteUser.namekey)] }, userCtrl.deleteUser);
    fastify.put('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.USER.updateUser.namekey)] }, userCtrl.updateUser);
}