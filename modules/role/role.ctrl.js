'use strict';
const roleCtrl = {};
const roleSchema = require('./role.schema');
const { isValidObjectId } = require('../../helpers');
const RolesEnum = require('./role.enum');
const { getModuleByName } = require('../module/module.ctrl');
const { getPermissionByModuleId } = require('../permission/permission.ctrl');
const ModulesEnum = require('../module/module.enum');

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

        const auth = await getModuleByName(ModulesEnum.AUTH.name);
        const permission = await getModuleByName(ModulesEnum.PERMISSIONS.name);
        const role = await getModuleByName(ModulesEnum.ROLES.name);
        const xmodule = await getModuleByName(ModulesEnum.MODULES.name);
        const user = await getModuleByName(ModulesEnum.USERS.name);

        const permissionAuth = await getPermissionByModuleId(auth._id);
        const allPermissionAuth = permissionAuth.map(permauth => permauth._id);

        const permissionPerm = await getPermissionByModuleId(permission._id);
        const allPermissionPerm = permissionPerm.map(perm => perm._id);

        const permissionRole = await getPermissionByModuleId(role._id);
        const allPermissionRole = permissionRole.map(permrole => permrole._id);

        const permissionXmod = await getPermissionByModuleId(xmodule._id);
        const allPermissionXmod = permissionXmod.map(permxmod => permxmod._id);

        const permissionUser = await getPermissionByModuleId(user._id);
        const allPermissionUser = permissionUser.map(permuser => permuser._id);

        const allpermissions = [
            ...allPermissionPerm,
            ...allPermissionAuth,
            ...allPermissionRole,
            ...allPermissionXmod,
            ...allPermissionUser
        ];

        const values = await Promise.all([
            new roleSchema({ name: RolesEnum.ADMINISTRATOR, permissions: allpermissions, description: 'Role created to manage the entire system' }).save(),
            new roleSchema({ name: RolesEnum.REGISTER, permissions: permissionAuth, description: 'Role created to use the system' }).save()
        ]);
    } catch (error) {
        console.error(error);
    }
};


module.exports = { roleCtrl, createRolesInit, getRoleByName };