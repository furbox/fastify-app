'use strict';
const bcrypt = require('bcryptjs');
const userCtrl = {};
const userSchema = require('./user.schema');
const { isValidObjectId } = require('../../helpers');
const _ = require('underscore');

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
                .populate('role')
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
    const { fullName, email, password, status, role } = _request.body;
    const userExist = await getUserByEmail(email, _reply);
    if (userExist) return _reply.code(401).send({ msg: 'This user already exists' });

    try {
        //agregar la informacion a la instancia de User
        const salt = bcrypt.genSaltSync();
        const user = new userSchema({
            fullName,
            email,
            password: bcrypt.hashSync(password, salt),
            role,
            status
        });
        //guardar el usuario en mongo
        const newUser = await createUser(user, _reply);
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
    const body = _.pick(_request.body, ['name', 'email', 'img', 'password', 'role', 'status', 'birthday']);
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
        const user = await userSchema.findById(id, 'name email img role').populate('role');

        if (!user) {
            return _reply.code(401).send({
                msg: 'This user already exists'
            });
        }
        return user;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

const getUserByEmail = async (email, _reply) => {
    try {
        const user = await userSchema.findOne({ email });
        return user;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}

const createUser = async (user, _reply) => {
    try {
        await user.save();
        return user;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal server error'
        });
    }
}


module.exports = userCtrl;