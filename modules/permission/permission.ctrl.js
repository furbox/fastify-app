'use strict';
const permissionCtrl = {};
const permissionSchema = require('./permission.schema');
const { isValidObjectId } = require('../../helpers');
// const PermissionsEnum = require('./permissions.enum');

permissionCtrl.getAllPersmissions = async (_request, _reply) => {
    try {
        const AllPersmissions = await permissionSchema.find({ status: true });
        _reply.send({
            result: AllPersmissions
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

permissionCtrl.getPersmission = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _reply);
        const permission = await permissionSchema.findOne({ id, status: true });
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

permissionCtrl.addPersmission = async (_request, _reply) => {
    const { name, namekey, description } = _request.body;
    const existPermission = await getPersmissionByName(namekey, _reply);
    if (existPermission) return _reply.code(401).send({ msg: 'This permission already exists' });
    try {
        const permission = new permissionSchema({ name, description, namekey });
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

permissionCtrl.updatePersmission = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        isValidObjectId(id, _reply);
        const persmissionUpdate = await permissionSchema.findByIdAndUpdate(id, _request.body, {
            new: true
        });
        _reply.send({
            result: persmissionUpdate
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

permissionCtrl.deletePersmission = async (_request, _reply) => {
    try {
        const id = _request.params.id;
        await isValidObjectId(id, _reply);
        const eliminaLogica = { status: false };
        const persmissionDelete = await permissionSchema.findByIdAndUpdate(id, eliminaLogica, { new: true });
        _reply.send({
            result: persmissionDelete
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

const getPersmissionByName = async (permissionNameKey, _reply) => {
    try {
        const permission = await permissionSchema.findOne({ namekey: permissionNameKey });
        return permission
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

// const createPermissionsInit = async () => {
//     try {
//         const count = await permissionSchema.estimatedDocumentCount();

//         if (count > 0) return;

//         const values = await Promise.all([
//             new permissionSchema({ name: RolesEnum.ADMINISTRATOR, description: 'Role created to manage the entire system' }).save(),
//             new permissionSchema({ name: RolesEnum.REGISTER, description: 'Role created to use the system' }).save()
//         ]);
//     } catch (error) {
//         console.error(error);
//     }
// };


module.exports = { permissionCtrl };