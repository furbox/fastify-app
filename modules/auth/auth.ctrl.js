const authCtrl = {};
const _ = require('underscore');
const bcrypt = require('bcryptjs');
const authSchema = require('./auth.schema');
const { createUser, getUserByEmail, upUser, getUserByCode, getUserById } = require('../user/user.ctrl');
const { validateSignin, validateSignup, validatePasswordChange, validateCode } = require('./auth.validation');
const { send } = require('../../helpers/response');
const { sendMail } = require('../../helpers/sendgrid');

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
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

authCtrl.signup = async (_request, _reply) => {
    try {
        const user = _.pick(_request.body, ['fullName', 'email', 'password']);
        const { error } = validateSignup(user.fullName, user.email, user.password);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        const userExist = await getUserByEmail(user.email, _request, _reply);
        if (userExist) return send(_request, _reply, 'This user already exists', 401);
        const newUser = await createUser(user, _request, _reply);

        sendMail({
            to: newUser.email,
            subject: 'Email Verification',
            html: '<h1>Verifica tu email:</h1><br><a href="http://' + _request.hostname + '/api/v1/auth/validation/' + newUser.codevalidate + '">Link</a>'
        });

        return send(_request, _reply, 'Email sent with a code for verification.', 201);
    } catch (err) {
        _request.log.error(err);
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

        //enviar mail para la confirmaci??n
        user.password = newEncryptPass;
        await upUser(user);

        sendMail({
            to: user.email,
            subject: 'Verificaci??n de Email',
            html: '<p>Nueva Contrase??a: ' + newPass + '</p><br><p>Recomendamos Cambiarla.</p>'
        });
        
        return send(_request, _reply, 'We have sent your new password to your email', 201);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

authCtrl.verifyAccount = async (_request, _reply) => {
    try {
        const code = _request.params.code;
        const { error } = validateCode(code);
        if (error) {
            return send(_request, _reply, error.details, 401);
        }
        const user = await getUserByCode(code, _request, _reply);
        if (!user) return send(_request, _reply, 'User does not exist or this account is actived', 401);
        if (user.status) return send(_request, _reply, 'The account is already active', 401);
        user.activationcode = true;
        user.status = true;
        await upUser(user, _reply);
        return send(_request, _reply, 'We have activated your account. You can login', 200);
    } catch (err) {
        _request.log.error(err);
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
        const userDB = await getUserById(data.user.user_id, _request, _reply);
        const token = await generarToken(userDB, _request, _reply);

        await addTokenUser(token, userDB._id, _request, _reply);
        return send(_request, _reply, 'ok', 201, {
            token: token,
            expiresIn: process.env.CADUCIDAD_TOKEN
        });
    } catch (err) {
        _request.log.error(err);
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
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

const getTokenByUserID = async (userID, _request, _reply) => {
    try {
        const data = await authSchema.findOne({ user: userID });
        if (!data) {
            return false;
        }
        return data
    } catch (err) {
        _request.log.error(err);
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
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

module.exports = { authCtrl, getTokenByUserID };