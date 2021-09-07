'use strict';
const permissionCtrl = {};
const permissionSchema = require('./permission.schema');
const { isValidObjectId } = require('../../helpers');
const { getModuleById, getModuleByName } = require('../module/module.ctrl');
const ModulesEnum = require('../module/module.enum');
const PermissionsEnum = require('./permission.enum');

permissionCtrl.getAllPermissions = async (_request, _reply) => {
    try {
        const AllPermissions = await permissionSchema.find({ status: true }).populate('module');
        _reply.send({
            result: AllPermissions
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

permissionCtrl.getPermission = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _request, _reply);
        const permission = await permissionSchema.findOne({ _id: id, status: true }).populate('module');
        if (!permission) {
            return _reply.code(401).send({
                msg: 'This permission dont exists'
            });
        }
        _reply.send({
            result: permission
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

permissionCtrl.addPermission = async (_request, _reply) => {
    const { name, namekey, description, module } = _request.body;
    const existModule = await getModuleById(module, _reply);
    if (!existModule) return _reply.code(401).send({ msg: 'This permission does not exists' });
    const existPermission = await getPermissionByName(namekey, _reply);
    if (existPermission) return _reply.code(401).send({ msg: 'This permission already exists' });
    try {
        const permission = new permissionSchema({ name, description, namekey, module });
        await permission.save();
        _reply.code(201).send({
            result: permission
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

permissionCtrl.updatePermission = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _request, _reply);
        const permissionUpdate = await permissionSchema.findByIdAndUpdate(id, _request.body, {
            new: true
        });
        _reply.send({
            result: permissionUpdate
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

permissionCtrl.deletePermission = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        await isValidObjectId(id, _request, _reply);
        const eliminaLogica = { status: false };
        const permissionDelete = await permissionSchema.findByIdAndUpdate(id, eliminaLogica, { new: true });
        _reply.send({
            result: permissionDelete
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

const getPermissionByName = async (permissionNameKey, _reply) => {
    try {
        const permission = await permissionSchema.findOne({ namekey: permissionNameKey });
        return permission
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

const getPermissionByModuleId = async (moduleId) => {
    const permissions = await permissionSchema.find({ module: moduleId });
    return permissions
}

const createPermissionsInit = async (_fastify) => {
    try {
        const count = await permissionSchema.estimatedDocumentCount();

        if (count > 0) return;

        const auth = await getModuleByName(ModulesEnum.AUTH.name);
        const permission = await getModuleByName(ModulesEnum.PERMISSIONS.name);
        const role = await getModuleByName(ModulesEnum.ROLES.name);
        const xmodule = await getModuleByName(ModulesEnum.MODULES.name);
        const user = await getModuleByName(ModulesEnum.USERS.name);

        const values = await Promise.all([
            new permissionSchema({
                name: PermissionsEnum.AUTH.refreshToken.name,
                namekey: PermissionsEnum.AUTH.refreshToken.namekey,
                description: PermissionsEnum.AUTH.refreshToken.description,
                module: auth._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.MODULE.getAllModules.name,
                namekey: PermissionsEnum.MODULE.getAllModules.namekey,
                description: PermissionsEnum.MODULE.getAllModules.description,
                module: xmodule._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.MODULE.addModule.name,
                namekey: PermissionsEnum.MODULE.addModule.namekey,
                description: PermissionsEnum.MODULE.addModule.description,
                module: xmodule._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.MODULE.getModule.name,
                namekey: PermissionsEnum.MODULE.getModule.namekey,
                description: PermissionsEnum.MODULE.getModule.description,
                module: xmodule._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.MODULE.updateModule.name,
                namekey: PermissionsEnum.MODULE.updateModule.namekey,
                description: PermissionsEnum.MODULE.updateModule.description,
                module: xmodule._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.MODULE.deleteModule.name,
                namekey: PermissionsEnum.MODULE.deleteModule.namekey,
                description: PermissionsEnum.MODULE.deleteModule.description,
                module: xmodule._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.PERMISSION.getAllPersmissions.name,
                namekey: PermissionsEnum.PERMISSION.getAllPersmissions.namekey,
                description: PermissionsEnum.PERMISSION.getAllPersmissions.description,
                module: permission._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.PERMISSION.addPermission.name,
                namekey: PermissionsEnum.PERMISSION.addPermission.namekey,
                description: PermissionsEnum.PERMISSION.addPermission.description,
                module: permission._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.PERMISSION.getPermission.name,
                namekey: PermissionsEnum.PERMISSION.getPermission.namekey,
                description: PermissionsEnum.PERMISSION.getPermission.description,
                module: permission._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.PERMISSION.updatePermission.name,
                namekey: PermissionsEnum.PERMISSION.updatePermission.namekey,
                description: PermissionsEnum.PERMISSION.updatePermission.description,
                module: permission._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.PERMISSION.deletePermission.name,
                namekey: PermissionsEnum.PERMISSION.deletePermission.namekey,
                description: PermissionsEnum.PERMISSION.deletePermission.description,
                module: permission._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.ROLE.getAllRoles.name,
                namekey: PermissionsEnum.ROLE.getAllRoles.namekey,
                description: PermissionsEnum.ROLE.getAllRoles.description,
                module: role._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.ROLE.addRole.name,
                namekey: PermissionsEnum.ROLE.addRole.namekey,
                description: PermissionsEnum.ROLE.addRole.description,
                module: role._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.ROLE.getRole.name,
                namekey: PermissionsEnum.ROLE.getRole.namekey,
                description: PermissionsEnum.ROLE.getRole.description,
                module: role._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.ROLE.updateRole.name,
                namekey: PermissionsEnum.ROLE.updateRole.namekey,
                description: PermissionsEnum.ROLE.updateRole.description,
                module: role._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.ROLE.deleteRole.name,
                namekey: PermissionsEnum.ROLE.deleteRole.namekey,
                description: PermissionsEnum.ROLE.deleteRole.description,
                module: role._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.ROLE.getRoleByName.name,
                namekey: PermissionsEnum.ROLE.getRoleByName.namekey,
                description: PermissionsEnum.ROLE.getRoleByName.description,
                module: role._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.USER.getUserById.name,
                namekey: PermissionsEnum.USER.getUserById.namekey,
                description: PermissionsEnum.USER.getUserById.description,
                module: user._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.USER.getAllUsers.name,
                namekey: PermissionsEnum.USER.getAllUsers.namekey,
                description: PermissionsEnum.USER.getAllUsers.description,
                module: user._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.USER.addUser.name,
                namekey: PermissionsEnum.USER.addUser.namekey,
                description: PermissionsEnum.USER.addUser.description,
                module: user._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.USER.deleteUser.name,
                namekey: PermissionsEnum.USER.deleteUser.namekey,
                description: PermissionsEnum.USER.deleteUser.description,
                module: user._id
            }).save(),
            new permissionSchema({
                name: PermissionsEnum.USER.updateUser.name,
                namekey: PermissionsEnum.USER.updateUser.namekey,
                description: PermissionsEnum.USER.updateUser.description,
                module: user._id
            }).save(),
        ]);
        _fastify.log.info('Successfully created permissions');
    } catch (error) {
        _fastify.log.error(err);
    }
};


module.exports = { permissionCtrl, createPermissionsInit, getPermissionByModuleId };