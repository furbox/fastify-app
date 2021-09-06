'use strict';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userCtrl = {};
const userSchema = require('./user.schema');
const { isValidObjectId } = require('../../helpers');
const _ = require('underscore');
const { getRoleByName } = require('../role/role.ctrl');
const RolesEnum = require('../role/role.enum');
const roleSchema = require('../role/role.schema');
const { send } = require('../../helpers/response');

userCtrl.getUserById = async (_request, _reply) => {
    const id = _request.params.id;
    try {
        const user = await getUserById(id, _reply);
        _reply.send({
            result: user
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

userCtrl.getAllUsers = async (_request, _reply) => {
    const { limit = 5, page = 0, status = true } = _request.query;
    try {
        const [total, users] = await Promise.all([
            userSchema.countDocuments({ status }),
            userSchema.find({ status })
                .skip(Number(page))
                .limit(Number(limit))
                .populate({
                    'path': 'role',
                    'select': 'name',
                    'populate': {
                        'path': 'permissions',
                        'select': 'name namekey',
                        'populate': {
                            'path': 'module',
                            'select': 'name'
                        }
                    }
                })
        ]);
        _reply.send({
            result: {
                total,
                users
            }
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
};

userCtrl.addUser = async (_request, _reply) => {
    const user = _.pick(_request.body, ['fullName', 'email', 'password', 'role', 'status']);
    const userExist = await getUserByEmail(user.email, _reply);
    if (userExist) return _reply.code(401).send({ msg: 'This user already exists' });

    try {
        //guardar el usuario en mongo
        const newUser = await createUser(user, _request, _reply);
        _reply.code(201).send({
            result: newUser
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}


userCtrl.updateUser = async (_request, _reply) => {
    const id = _request.params.id;
    await isValidObjectId(id, _reply);
    const body = _.pick(_request.body, ['fullName', 'email', 'img', 'password', 'role', 'status', 'birthday']);
    try {
        const user = await userSchema.findByIdAndUpdate(id, body, { new: true });
        _reply.code(201).send({
            result: user
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

userCtrl.deleteUser = async (_request, _reply) => {
    const id = _request.params.id;
    await isValidObjectId(id, _reply);
    const eliminaLogica = { status: false };
    try {
        const user = await userSchema.findByIdAndUpdate(id, eliminaLogica, { new: true });
        _reply.code(201).send({
            result: user
        });
    } catch (error) {
        return _reply.status(500).json({
            msg: 'Internal server error'
        });
    }
}

const getUserById = async (id, _reply) => {
    await isValidObjectId(id, _reply);
    try {
        const user = await userSchema.findById(id, 'fullName email img role status').populate({
            'path': 'role',
            'select': 'name',
            'populate': {
                'path': 'permissions',
                'select': 'name namekey',
                'populate': {
                    'path': 'module',
                    'select': 'name'
                }
            }
        });

        if (!user) {
            return _reply.code(401).send({
                msg: 'User does not exist'
            });
        }
        return user;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

const getUserByCode = async (code, _reply) => {
    try {
        const user = await userSchema.findOne({ codevalidate: code, activationcode: false });
        return user;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

const getUserByEmail = async (email, _reply) => {
    try {
        const user = await userSchema.findOne({ email, status: true }).populate({
            'path': 'role',
            'select': 'name',
            'populate': {
                'path': 'permissions',
                'select': 'name namekey',
                'populate': {
                    'path': 'module',
                    'select': 'name'
                }
            }
        });
        return user;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

const createUser = async (addUser, _request, _reply) => {
    let role;
    try {
        if (!addUser.role) {
            const defaultRole = await getRoleByName(RolesEnum.REGISTER, _reply);
            role = defaultRole._id;
        } else {
            role = addUser.role;
        }
        const hash = await crypto.randomBytes(32);
        const salt = bcrypt.genSaltSync();
        const newUser = {
            fullName: addUser.fullName,
            email: addUser.email,
            password: bcrypt.hashSync(addUser.password, salt),
            role: role,
            status: addUser.status ? addUser.status : false,
            codevalidate: hash.toString('hex')
        };

        const user = new userSchema(newUser);
        await user.save();
        return user;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

const upUser = async (user, _reply) => {
    try {
        await user.save();
        return true;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}


const createUserInit = async () => {
    try {
        const count = await userSchema.estimatedDocumentCount();

        if (count > 0) return;

        const admin = await roleSchema.findOne({ name: RolesEnum.ADMINISTRATOR });

        const salt = bcrypt.genSaltSync();
        const values = await Promise.all([
            new userSchema({ fullName: 'admin@admin.com', email: 'admin@admin.com', password: bcrypt.hashSync('Admin123', salt), role: admin._id, status:true }).save()
        ]);
    } catch (error) {
        console.error(error);
    }
};


module.exports = { userCtrl, createUser, getUserByEmail, getUserById, getUserByCode, upUser, createUserInit };