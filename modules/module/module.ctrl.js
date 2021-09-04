'use strict';

const moduleCtrl = {};
const moduleSchema = require('./module.schema');
const { isValidObjectId } = require('../../helpers');
const ModulesEnum = require('./module.enum');

moduleCtrl.getAllModules = async (_request, _reply) => {
    try {
        const allModules = await moduleSchema.find({ status: true });
        _reply.send({
            result: allModules
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

moduleCtrl.getModule = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _reply);
        const module = await moduleSchema.findOne({ id, status: true });
        if (!module) {
            return _reply.code(401).send({
                msg: 'The module does not exist'
            });
        }
        _reply.send({
            result: module
        });
    } catch (error) {
        console.log(error)
        return _reply.code(500).send({
            msg: 'Internal server error',
        });
    }
};

moduleCtrl.addModule = async (_request, _reply) => {
    const { name, description } = _request.body;
    const existModule = await getModuleByName(name, _reply);
    if (existModule) return _reply.code(401).send({ msg: 'This module already exists' });
    try {
        const module = new moduleSchema({ name, description });
        await module.save();
        _reply.code(201).send({
            result: module
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

moduleCtrl.updateModule = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _reply);
        const moduleUpdate = await moduleSchema.findByIdAndUpdate(id, _request.body, {
            new: true
        });
        _reply.send({
            result: moduleUpdate
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

moduleCtrl.deleteModule = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _reply);
        const eliminaLogica = { status: false };
        const moduleDelete = await moduleSchema.findByIdAndUpdate(id, eliminaLogica, { new: true });
        _reply.send({
            result: moduleDelete
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

const getModuleByName = async (moduleName, _reply) => {
    try {
        const oneModule = await moduleSchema.findOne({ name: moduleName });
        return oneModule;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

const getModuleById = async (id, _reply) => {
    await isValidObjectId(id, _reply);
    try {
        const module = await moduleSchema.findById(id);

        if (!module) {
            return _reply.code(401).send({
                msg: 'Module does not exist'
            });
        }
        return module;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

const createModulesInit = async () => {
    try {
        const count = await moduleSchema.estimatedDocumentCount();

        if (count > 0) return;

        const values = await Promise.all([
            new moduleSchema({ name: ModulesEnum.AUTH.name, description: ModulesEnum.AUTH.description }).save(),
            new moduleSchema({ name: ModulesEnum.ROLES.name, description: ModulesEnum.ROLES.description }).save(),
            new moduleSchema({ name: ModulesEnum.PERMISSIONS.name, description: ModulesEnum.PERMISSIONS.description }).save(),
            new moduleSchema({ name: ModulesEnum.USERS.name, description: ModulesEnum.USERS.description }).save(),
            new moduleSchema({ name: ModulesEnum.MODULES.name, description: ModulesEnum.MODULES.description }).save()
        ]);
    } catch (error) {
        console.error(error);
    }
};


module.exports = { moduleCtrl, getModuleById, createModulesInit, getModuleByName };