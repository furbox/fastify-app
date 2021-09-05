'use strict';

const { moduleCtrl } = require('../../modules/module/module.ctrl');
const PermissionsEnum = require('../../modules/permission/permission.enum');

module.exports = async function (fastify, opts) {
    fastify.get('/', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.MODULE.getAllModules.namekey)] }, moduleCtrl.getAllModules);
    fastify.post('/', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.MODULE.addModule.namekey)] }, moduleCtrl.addModule);
    fastify.get('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.MODULE.getModule.namekey)] }, moduleCtrl.getModule);
    fastify.put('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.MODULE.updateModule.namekey)] }, moduleCtrl.updateModule);
    fastify.delete('/:id', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.MODULE.deleteModule.namekey)] }, moduleCtrl.deleteModule);
}