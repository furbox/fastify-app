'use strict';

const moduleCtrl = {};
const _ = require('underscore');
const moduleSchema = require('./module.schema');
const { isValidObjectId } = require('../../helpers');
const ModulesEnum = require('./module.enum');
const { send } = require('../../helpers/response');
const { validatePagination, validateId } = require('../../helpers/validations');
const { validateModuleCreate } = require('./module.validation');

moduleCtrl.getAllModules = async (_request, _reply) => {
    const { limit = 5, page = 0, status = true } = _request.query;
    const { error } = validatePagination(limit, page, status);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
    try {
        const [total, modules] = await Promise.all([
            moduleSchema.countDocuments({ status }),
            moduleSchema.find({ status })
                .skip(Number(page))
                .limit(Number(limit))
        ]);
        return send(_request, _reply, 'ok', 200, {
            total,
            modules
        });
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

moduleCtrl.getModule = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        const { error } = validateId(id);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        isValidObjectId(id, _request, _reply);
        const module = await moduleSchema.findOne({ _id: id, status: true });
        if (!module) {
            return send(_request, _reply, 'The module does not exist', 401);
        }
        return send(_request, _reply, 'ok', 200, module);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

moduleCtrl.addModule = async (_request, _reply) => {
    try {
        const body = _.pick(_request.body, ['name', 'description']);
        const { error } = validateModuleCreate(body.name, body.description);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        const existModule = await getModuleByName(body.name, _request, _reply);
        if (existModule) return send(_request, _reply, 'This module already exists', 401);
        const module = new moduleSchema({ name: body.name, description: body.description });
        await module.save();
        return send(_request, _reply, 'ok', 201, module);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

moduleCtrl.updateModule = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        const { error: errorid } = validateId(id);
        if (errorid) {
            return send(_request, _reply, error.details, 401);
        }
        isValidObjectId(id, _request, _reply);
        const body = _.pick(_request.body, ['name', 'description']);
        const { error } = validateModuleCreate(body.name, body.description);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        const moduleUpdate = await moduleSchema.findByIdAndUpdate(id, body, {
            new: true
        });
        return send(_request, _reply, 'ok', 201, moduleUpdate);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

moduleCtrl.deleteModule = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        const { error } = validateId(id);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        isValidObjectId(id, _request, _reply);
        const eliminaLogica = { status: false };
        const moduleDelete = await moduleSchema.findByIdAndUpdate(id, eliminaLogica, { new: true });
        return send(_request, _reply, 'ok', 200, moduleDelete);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

const getModuleByName = async (moduleName, _request, _reply) => {
    try {
        const oneModule = await moduleSchema.findOne({ name: moduleName });
        return oneModule;
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

const getModuleById = async (id, _request, _reply) => {
    await isValidObjectId(id, _request, _reply);
    try {
        const module = await moduleSchema.findById(id);
        if (!module) {
            return send(_request, _reply, 'Module does not exist', 401);
        }
        return module;
    } catch (error) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const createModulesInit = async (_fastify) => {
    try {
        const count = await moduleSchema.estimatedDocumentCount();

        if (count > 0) return;

        const values = await Promise.all([
            new moduleSchema({ name: ModulesEnum.AUTH.name, description: ModulesEnum.AUTH.description }).save(),
            new moduleSchema({ name: ModulesEnum.ROLES.name, description: ModulesEnum.ROLES.description }).save(),
            new moduleSchema({ name: ModulesEnum.PERMISSIONS.name, description: ModulesEnum.PERMISSIONS.description }).save(),
            new moduleSchema({ name: ModulesEnum.USERS.name, description: ModulesEnum.USERS.description }).save(),
            new moduleSchema({ name: ModulesEnum.MODULES.name, description: ModulesEnum.MODULES.description }).save(),
            new moduleSchema({ name: ModulesEnum.PROFILE.name, description: ModulesEnum.PROFILE.description }).save()
        ]);
        _fastify.log.info('Successfully created modules')
    } catch (error) {
        _fastify.log.error(error);
    }
};


module.exports = { moduleCtrl, getModuleById, createModulesInit, getModuleByName };