'use strict';

const PermissionsEnum = require('../../modules/permission/permission.enum');
const { roleCtrl } = require('../../modules/role/role.ctrl');

module.exports = async function (fastify, opts) {
    fastify.get('/', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.ROLE.getAllRoles.namekey)] }, roleCtrl.getAllRoles);
    fastify.post('/', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.ROLE.addRole.namekey)] }, roleCtrl.addRole);
    fastify.get('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.ROLE.getRole.namekey)] }, roleCtrl.getRole);
    fastify.put('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.ROLE.updateRole.namekey)] }, roleCtrl.updateRole);
    fastify.delete('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.ROLE.deleteRole.namekey)] }, roleCtrl.deleteRole);
    fastify.get('/name/:name', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.ROLE.getRoleByName.namekey)] }, roleCtrl.getRoleByName);
}