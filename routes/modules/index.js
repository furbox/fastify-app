'use strict';

const { moduleCtrl } = require('../../modules/module/module.ctrl');

module.exports = async function (fastify, opts) {
    fastify.get('/', { preValidation: [fastify.authenticate] }, moduleCtrl.getAllModules);
    fastify.post('/', { preValidation: [fastify.authenticate] }, moduleCtrl.addModule);
    fastify.get('/:id', { preValidation: [fastify.authenticate] }, moduleCtrl.getModule);
    fastify.put('/:id', { preValidation: [fastify.authenticate] }, moduleCtrl.updateModule);
    fastify.delete('/:id', { preValidation: [fastify.authenticate] }, moduleCtrl.deleteModule);
}