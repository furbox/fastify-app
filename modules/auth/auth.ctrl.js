const authCtrl = {};
const { createUser, getUserByEmail, upUser, getUserByCode, getUserById } = require('../user/user.ctrl');
const authSchema = require('./auth.schema');
const _ = require('underscore');
const bcrypt = require('bcryptjs');
const { send } = require('../../helpers/response');
const { validateSignin, validateSignup, validatePasswordChange, validateCode } = require('./auth.validation');

authCtrl.signin = async (_request, _reply) => {
    const body = _.pick(_request.body, ['email', 'password']);
    try {
        const { error } = validateSignin(body.email, body.password);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        const user = await getUserByEmail(body.email, _request, _reply);
        if (!user) return send(_request, _reply, 'User does not exist', 401);
        user.countlogin++;
        if (!bcrypt.compareSync(body.password, user.password)) {
            return send(_request, _reply, 'Invalid data', 401);
        }
        const token = await generarToken(user, _request, _reply);
        await addTokenUser(token, user._id, _request, _reply);
        return send(_request, _reply, 'ok', 200, token);
    } catch (error) {
        return send(_request, _reply, 'Internal server error', 500);
    }
}

authCtrl.signup = async (_request, _reply) => {
    const user = _.pick(_request.body, ['fullName', 'email', 'password']);
    const { error } = validateSignup(body.fullName, body.email, body.password);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
    const userExist = await getUserByEmail(user.email, _request, _reply);
    if (userExist) return send(_request, _reply, 'This user already exists', 401);
    try {
        const newUser = await createUser(user, _request, _reply);

        //TODO: envios de emails
        // sendMail({
        //     to: newUser.email,
        //     subject: 'Verificación de Email',
        //     html: '<h1>Verifica tu email:</h1><br><a href="http://' + req.get('Host') + '/api/v1/auth/verify-account/' + user.codevalidate + '">Link</a>'
        // });
        return send(_request, _reply, 'Email sent with a code for verification.', 201);
    } catch (error) {
        return send(_request, _reply, 'Internal server error', 500);
    }
}

authCtrl.changePassword = async (_request, _reply) => {
    const body = _.pick(_request.body, ['email']);
    try {
        const { error } = validatePasswordChange(body.email);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        const user = await getUserByEmail(body.email, _request, _reply);
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
        return send(_request, _reply, 'We have sent your new password to your email', 201);
    } catch (error) {
        return send(_request, _reply, 'Internal server error', 500);
    }
}

authCtrl.verifyAccount = async (_request, _reply) => {
    const body = _.pick(_request.body, ['email']);
    try {
        const { error } = validateCode(body.code);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        const user = await getUserByCode(body.code, _request, _reply);
        if (!user) return send(_request, _reply, 'User does not exist or this account is actived', 401);
        if (user.status) return send(_request, _reply, 'The account is already active', 401);
        user.activationcode = true;
        user.status = true;
        await upUser(user, _reply);
        return send(_request, _reply, 'We have activated your account. You can login', 200);
    } catch (error) {
        return send(_request, _reply, 'Internal server error', 500);
    }
}

authCtrl.refreshToken = async (_request, _reply) => {
    const { authorization } = _request.headers;
    if (!authorization) {
        return send(_request, _reply, 'missing authorization in headers', 401);
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
        return send(_request, _reply, 'ok', 201, {
            token: token,
            expiresIn: process.env.CADUCIDAD_TOKEN
        });
    } catch (error) {
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const addTokenUser = async (token, userid, _request, _reply) => {
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
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const generarToken = async (user, _request, _reply) => {
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
        return send(_request, _reply, 'Internal server error', 500);
    }
}

module.exports = authCtrl;