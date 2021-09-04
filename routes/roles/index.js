'use strict';

const { roleCtrl } = require('../../modules/role/role.ctrl');

module.exports = async function (fastify, opts) {
    fastify.get('/', { preValidation: [fastify.authenticate] }, roleCtrl.getAllRoles);
    fastify.post('/', { preValidation: [fastify.authenticate] }, roleCtrl.addRole);
    fastify.get('/:id', { preValidation: [fastify.authenticate] }, roleCtrl.getRole);
    fastify.put('/:id', { preValidation: [fastify.authenticate] }, roleCtrl.updateRole);
    fastify.delete('/:id', { preValidation: [fastify.authenticate] }, roleCtrl.deleteRole);
}