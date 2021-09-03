'use strict';

const { permissionCtrl } = require('../../modules/permission/permission.ctrl');

module.exports = async function (fastify, opts) {
    fastify.get('/', permissionCtrl.getAllPersmissions);
    fastify.post('/', permissionCtrl.addPersmission);
    fastify.get('/:id', permissionCtrl.getPersmission);
    fastify.put('/:id', permissionCtrl.updatePersmission);
    fastify.delete('/:id', permissionCtrl.deletePersmission);
}