'use strict';
const roleCtrl = {};
const roleSchema = require('./role.schema');
const { isValidObjectId } = require('../../helpers');
const RolesEnum = require('./role.enum');

roleCtrl.getAllRoles = async (_request, _reply) => {
    try {
        const allRoles = await roleSchema.find({ status: true }).populate({
            'path': 'permissions',
            'select': 'name namekey'
        });
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
        const role = await roleSchema.findOne({ id, status: true }).populate({
            'path': 'permissions',
            'select': 'name namekey'
        });

        if (!role) {
            return _reply.code(401).send({
                msg: 'This role does not exists'
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

roleCtrl.getRoleByName = async (_request, _reply) => {
    try {
        const name = _request.params.name;
        name.toUpperCase();
        const role = await getRoleByName(name, _reply);

        if (!role) {
            return _reply.code(401).send({
                msg: 'This role does not exists'
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
    const { name, description, permissions } = _request.body;
    name.toUpperCase();
    const existRole = await getRoleByName(name, _reply);
    if (existRole) return _reply.code(401).send({ msg: 'This role already exists' });
    try {
        const role = new roleSchema({ name, description, permissions });
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

const getRoleByName = async (roleName, _reply) => {
    try {
        const role = await roleSchema.findOne({ name: roleName }).populate({
            'path': 'permissions',
            'select': 'name namekey'
        });
        return role
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

const createRolesInit = async () => {
    try {
        const count = await roleSchema.estimatedDocumentCount();

        if (count > 0) return;

        const values = await Promise.all([
            new roleSchema({ name: RolesEnum.ADMINISTRATOR, description: 'Role created to manage the entire system' }).save(),
            new roleSchema({ name: RolesEnum.REGISTER, description: 'Role created to use the system' }).save()
        ]);
    } catch (error) {
        console.error(error);
    }
};


module.exports = { roleCtrl, createRolesInit, getRoleByName };