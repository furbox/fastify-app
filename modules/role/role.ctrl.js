'use strict';
const roleCtrl = {};
const boom = require('boom');
const roleSchema = require('./role.schema');
const { isValidObjectId } = require('../../helpers');

roleCtrl.getAllRoles = async (_request, _reply) => {
    try {
        const allRoles = await roleSchema.find({ status: true });
        _reply.send({
            result: allRoles
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

roleCtrl.getRole = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _reply);
        const role = await roleSchema.findById(id, { status: true });
        if (!role) {
            return _reply.code(401).send({
                msg: 'IThis user already exists'
            });
        }
        _reply.send({
            result: role
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

roleCtrl.addRole = async (_request, _reply) => {
    try {
        const role = new roleSchema(_request.body);
        await role.save();
        _reply.code(201).send({
            result: role
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

roleCtrl.updateRole = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _reply);
        const roleUpdate = await roleSchema.findByIdAndUpdate(id, _request.body, {
            new: true
        });
        _reply.send({
            result: roleUpdate
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

roleCtrl.deleteRole = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _reply);
        const eliminaLogica = { status: false };
        const roleDelete = await roleSchema.findByIdAndUpdate(id, eliminaLogica, { new: true });
        _reply.send({
            result: roleDelete
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

module.exports = roleCtrl;