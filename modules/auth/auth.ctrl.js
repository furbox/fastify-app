const authCtrl = {};
const { createUser, getUserByEmail, upUser, getUserByCode, getUserById } = require('../user/user.ctrl');
const authSchema = require('./auth.schema');
const _ = require('underscore');
const bcrypt = require('bcryptjs');

authCtrl.signin = async (_request, _reply) => {
    const body = _.pick(_request.body, ['email', 'password']);
    try {
        const user = await getUserByEmail(body.email, _reply);
        if (!user) return _reply.code(401).send({ msg: 'User does not exist' });
        user.countlogin++;
        if (!bcrypt.compareSync(body.password, user.password)) {
            return _reply.code(401).send({
                msg: 'Invalid data'
            });
        }
        const token = await generarToken(user, _reply);
        await addTokenUser(token, user._id, _reply);
        _reply.send({ token });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal Server Error'
        });
    }
}

authCtrl.signup = async (_request, _reply) => {
    const user = _.pick(_request.body, ['fullName', 'email', 'password']);
    const userExist = await getUserByEmail(user.email, _reply);
    if (userExist) return _reply.code(401).send({ msg: 'This user already exists' });
    try {
        const newUser = await createUser(user, _reply);

        //TODO: envios de emails
        // sendMail({
        //     to: newUser.email,
        //     subject: 'Verificación de Email',
        //     html: '<h1>Verifica tu email:</h1><br><a href="http://' + req.get('Host') + '/api/v1/auth/verify-account/' + user.codevalidate + '">Link</a>'
        // });

        _reply.code(201).send({
            msg: 'Email sent with a code for verification.'
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal Server Error'
        });
    }
}

authCtrl.changePassword = async (_request, _reply) => {
    const body = _.pick(_request.body, ['email']);

    try {
        const user = await getUserByEmail(body.email, _reply);
        const data = new Date();
        const salt = bcrypt.genSaltSync();
        const buff = new Buffer.from(data.toISOString());
        const newPass = buff.toString('base64');
        const newEncryptPass = bcrypt.hashSync(newPass, salt);

        //enviar mail para la confirmación
        user.password = newEncryptPass;
        await upUser(user);

        // sendMail({
        //     to: user.email,
        //     subject: 'Verificación de Email',
        //     html: '<p>Nueva Contraseña: ' + newPass + '</p><br><p>Recomendamos Cambiarla.</p>'
        // });

        _reply.code(201).send({
            msg: 'We have sent your new password to your email'
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal Server Error'
        });
    }
}

authCtrl.verifyAccount = async (_request, _reply) => {
    const code = _request.params.code;
    try {
        const user = await getUserByCode(code, _reply);
        if (!user) return _reply.code(401).send({ msg: 'User does not exist or this account is actived' });
        if (user.status) return _reply.code(401).send({ msg: 'The account is already active' });
        user.activationcode = true;
        user.status = true;
        await upUser(user, _reply);
        _reply.code(201).send({
            msg: 'We have activated your account. You can login'
        });
    } catch (error) {
        console.log(error);
        return _reply.code(500).send({
            msg: 'Internal Server Error'
        });
    }
}

authCtrl.refreshToken = async (_request, _reply) => {
    const { authorization } = _request.headers;
    if (!authorization) {
        throw new Error('missing authorization in headers');
    }
    //obtener el token actual
    const actualToken = authorization.split(' ')[1];
    //se puede validar cuanto tiempo le queda para expirar
    //renovar solo si es necesario

    const data = await _request.jwtVerify();
    try {
        //const tokenDB = await authSchema.findOne({ user: data.user.user_id });
        const userDB = await getUserById(data.user.user_id, _reply);
        const token = await generarToken(userDB, _reply);

        await addTokenUser(token, userDB._id, _reply);
        _reply.code(201).send({
            token: token,
            expiresIn: process.env.CADUCIDAD_TOKEN
        });
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal Server Error'
        });
    }
}

const addTokenUser = async (token, userid, _reply) => {
    try {
        const tokenExist = await authSchema.findOne({ user: userid });
        if (!tokenExist) {
            const tokensave = new authSchema({
                token: token,
                user: userid
            });
            await tokensave.save();
        } else {
            tokenExist.token = token;
            await tokenExist.save();
        }
        return true;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal Server Error'
        });
    }
}

const generarToken = async (user, _reply) => {
    try {
        const payload = {
            user: {
                user_id: user._id,
                user_name: user.fullName,
                user_email: user.email,
                user_role: user.role.name
            },
        }
        await upUser(user);

        const token = await _reply.jwtSign(payload, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });
        return token;
    } catch (error) {
        return _reply.code(500).send({
            msg: 'Internal Server Error'
        });
    }
}

module.exports = authCtrl;