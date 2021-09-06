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
const { validateId, validateUserCreate, validatePagination } = require('./user.validation');

userCtrl.getUserById = async (_request, _reply) => {
    const id = _request.params.id;
    const { error } = validateId(id);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
    try {
        const user = await getUserById(id, _request, _reply);
        return send(_request, _reply, 'ok', 200, user);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

userCtrl.getAllUsers = async (_request, _reply) => {
    const { limit = 5, page = 0, status = true } = _request.query;
    const { error } = validatePagination(limit, page, status);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
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
        return send(_request, _reply, 'ok', 200, {
            total,
            users
        });
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
};

userCtrl.addUser = async (_request, _reply) => {
    const user = _.pick(_request.body, ['fullName', 'email', 'password', 'role', 'status']);
    const { error } = validateUserCreate(user.fullName, user.email, user.password, user.role, user.status);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
    const userExist = await getUserByEmail(user.email, _request, _reply);
    if (userExist) return send(_request, _reply, 'This user already exists', 401);
    try {
        //guardar el usuario en mongo
        const newUser = await createUser(user, _request, _reply);
        return send(_request, _reply, 'ok', 201, newUser);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}


userCtrl.updateUser = async (_request, _reply) => {
    const id = _request.params.id;
    await isValidObjectId(id, _request, _reply);
    const body = _.pick(_request.body, ['fullName', 'email', 'password', 'role', 'status']);
    const { error } = validateUserCreate(body.fullName, body.email, body.password, body.role, body.status);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
    try {
        const user = await userSchema.findByIdAndUpdate(id, body, { new: true });
        return send(_request, _reply, 'ok', 201, user);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

userCtrl.deleteUser = async (_request, _reply) => {
    const id = _request.params.id;
    const { error } = validateId(id);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
    await isValidObjectId(id, _request, _reply);
    const eliminaLogica = { status: false };
    const user = await getUserById(id);
    try {
        const userDelete = await userSchema.findByIdAndUpdate(user.id, eliminaLogica, { new: true });
        return send(_request, _reply, 'ok', 200, userDelete);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const getUserById = async (id, _request, _reply) => {
    await isValidObjectId(id, _request, _reply);
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
            return send(_request, _reply, 'User does not exist', 401);
        }
        return user;
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const getUserByCode = async (code, _request, _reply) => {
    try {
        const user = await userSchema.findOne({ codevalidate: code, activationcode: false });
        return user;
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const getUserByEmail = async (email, _request, _reply) => {
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
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const createUser = async (addUser, _request, _reply) => {
    let role;
    try {
        if (!addUser.role) {
            const defaultRole = await getRoleByName(RolesEnum.REGISTER, _request, _reply);
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
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const upUser = async (user, _request, _reply) => {
    try {
        await user.save();
        return true;
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}


const createUserInit = async () => {
    try {
        const count = await userSchema.estimatedDocumentCount();

        if (count > 0) return;

        const admin = await roleSchema.findOne({ name: RolesEnum.ADMINISTRATOR });

        const salt = bcrypt.genSaltSync();
        const values = await Promise.all([
            new userSchema({ fullName: 'admin@admin.com', email: 'admin@admin.com', password: bcrypt.hashSync('Admin123', salt), role: admin._id, status: true }).save()
        ]);
    } catch (error) {
        console.error(error);
    }
};


module.exports = { userCtrl, createUser, getUserByEmail, getUserById, getUserByCode, upUser, createUserInit };