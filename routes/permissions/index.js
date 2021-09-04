'use strict';

const { permissionCtrl } = require('../../modules/permission/permission.ctrl');

module.exports = async function (fastify, opts) {
    fastify.get('/', { preValidation: [fastify.authenticate] }, permissionCtrl.getAllPermissions);
    fastify.post('/', { preValidation: [fastify.authenticate] }, permissionCtrl.addPermission);
    fastify.get('/:id', { preValidation: [fastify.authenticate] }, permissionCtrl.getPermission);
    fastify.put('/:id', { preValidation: [fastify.authenticate] }, permissionCtrl.updatePermission);
    fastify.delete('/:id', { preValidation: [fastify.authenticate] }, permissionCtrl.deletePermission);
}