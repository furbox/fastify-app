const authCtrl = {};
const { createUser, getUserByEmail, upUser, getUserByCode } = require('../user/user.ctrl');
const _ = require('underscore');

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

        const token = await generarToken(user._id);
        await upUser(user);
        await addTokenUser(token, user._id);
        res.status(201).json({
            token,
            expiresIn: process.env.CADUCIDAD_TOKEN
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ocurrio un error en el servidor'
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

authCtrl.changePassword = async (_request, _reply) => { }

authCtrl.verifyAccount = async (_request, _reply) => {
    const code = _request.params.code;
    try {
        const user = await getUserByCode(code, _reply);
        if (!user) return _reply.code(401).send({ msg: 'User does not exist' });
        if (user.status) return _reply.code(401).send({ msg: 'The account is already active' });
        if (user.activationcode) return _reply.code(401).send({ msg: 'The account is already active' });
        user.activationcode = true;
        user.status = true;
        await upUser(user, _reply);
        _reply.code(201).send({
            msg: 'We have activated your account. You can login'
        });
    } catch (error) {
        console.log(error);
        return _reply.code(500).send({
            msg: 'Ocurrio un error en el servidor'
        });
    }
}

authCtrl.refreshToken = async (_request, _reply) => { }

authCtrl.addTokenUser = async (_request, _reply) => { }

module.exports = authCtrl;