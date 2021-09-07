'use strict';
const roleCtrl = {};
const roleSchema = require('./role.schema');
const { isValidObjectId } = require('../../helpers');
const RolesEnum = require('./role.enum');
const { getModuleByName } = require('../module/module.ctrl');
const { getPermissionByModuleId } = require('../permission/permission.ctrl');
const ModulesEnum = require('../module/module.enum');
const RoleValidation = require('./role.validation');
const _ = require('underscore');
const { send } = require('../../helpers/response');
const { validatePagination, validateId } = require('../../helpers/validations');

roleCtrl.getAllRoles = async (_request, _reply) => {
    const { limit = 5, page = 0, status = true } = _request.query;
    const { error } = validatePagination(limit, page, status);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
    try {
        const [total, roles] = await Promise.all([
            roleSchema.countDocuments({ status }),
            roleSchema.find({ status })
                .skip(Number(page))
                .limit(Number(limit))
                .populate({
                    'path': 'permissions',
                    'select': 'name namekey'
                })
        ]);
        return send(_request, _reply, 'ok', 200, {
            total,
            roles
        });
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

roleCtrl.getRole = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        const { error } = validateId(id);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        isValidObjectId(id, _request, _reply);
        const role = await roleSchema.findOne({ id, status: true }).populate({
            'path': 'permissions',
            'select': 'name namekey'
        });

        if (!role) {
            return send(_request, _reply, 'This role does not exists', 401);
        }
        return send(_request, _reply, 'ok', 200, role);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

roleCtrl.getRoleByName = async (_request, _reply) => {
    try {
        const name = _request.params.name;
        name.toUpperCase();
        const role = await getRoleByName(name, _request, _reply);

        if (!role) {
            return send(_request, _reply, 'This role does not exists', 401);
        }
        return send(_request, _reply, 'User fetched successfully', 200, role);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Unable to get user', 500);
    }
};

roleCtrl.addRole = async (_request, _reply) => {
    try {
        const body = _.pick(_request.body, ['name', 'description', 'permissions']);
        const { error } = RoleValidation.validateRole(body.name, body.description);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        body.name.toUpperCase();
        const existRole = await getRoleByName(body.name, _request, _reply);
        if (existRole) return send(_request, _reply, 'This role already exists', 401);
        const role = new roleSchema({ name: body.name, description: body.description, permissions: body.permissions });
        await role.save();

        return send(_request, _reply, 'ok', 201, role);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

roleCtrl.updateRole = async (_request, _reply) => {
    const id = _request.params.id;
    const { error } = validateId(id);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
    const body = _.pick(_request.body, ['name', 'description', 'permissions']);
    try {
        isValidObjectId(id, _request, _reply);
        const roleUpdate = await roleSchema.findByIdAndUpdate(id, body, {
            new: true
        });
        return send(_request, _reply, 'ok', 200, roleUpdate);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

roleCtrl.deleteRole = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        const { error } = validateId(id);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        isValidObjectId(id, _request, _reply);
        const eliminaLogica = { status: false };
        const roleDelete = await roleSchema.findByIdAndUpdate(id, eliminaLogica, { new: true });

        return send(_request, _reply, 'ok', 200, roleDelete);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

const getRoleByName = async (roleName, _request, _reply) => {
    try {
        const { error } = RoleValidation.validateName(roleName);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        const role = await roleSchema.findOne({ name: roleName }).populate({
            'path': 'permissions',
            'select': 'name namekey'
        });
        return role
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const createRolesInit = async (_fastify) => {
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

        await Promise.all([
            new roleSchema({ name: RolesEnum.ADMINISTRATOR, permissions: allpermissions, description: 'Role created to manage the entire system' }).save(),
            new roleSchema({ name: RolesEnum.REGISTER, permissions: permissionAuth, description: 'Role created to use the system' }).save()
        ]);
        _fastify.log.info('Successfully created roles');
    } catch (err) {
        _fastify.log.error(err);
    }
};


module.exports = { roleCtrl, createRolesInit, getRoleByName };