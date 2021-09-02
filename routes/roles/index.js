'use strict';

const { roleCtrl } = require('../../modules/role/role.ctrl');

module.exports = async function (fastify, opts) {
    fastify.get('/', roleCtrl.getAllRoles);
    fastify.post('/', roleCtrl.addRole);
    fastify.get('/:id', roleCtrl.getRole);
    fastify.put('/:id', roleCtrl.updateRole);
    fastify.delete('/:id', roleCtrl.deleteRole);
}