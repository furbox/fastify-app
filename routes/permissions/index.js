'use strict';

const { permissionCtrl } = require('../../modules/permission/permission.ctrl');
const PermissionsEnum = require('../../modules/permission/permission.enum');

module.exports = async function (fastify, opts) {
    fastify.get('/', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.PERMISSION.getAllPersmissions.namekey)] }, permissionCtrl.getAllPermissions);
    fastify.post('/', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.PERMISSION.addPermission.namekey)] }, permissionCtrl.addPermission);
    fastify.get('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.PERMISSION.getPermission.namekey)] }, permissionCtrl.getPermission);
    fastify.put('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.PERMISSION.updatePermission.namekey)] }, permissionCtrl.updatePermission);
    fastify.delete('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.PERMISSION.deletePermission.namekey)] }, permissionCtrl.deletePermission);
}