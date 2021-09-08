const bcrypt = require('bcryptjs');
const profileCtrl = {};
const userSchema = require('../user/user.schema');
const _ = require('underscore');
const { send } = require('../../helpers/response');
const { validateProfileUpdate, validateChangePassword } = require('./profile.validation');
const { getUserById } = require('../user/user.ctrl');

profileCtrl.profileUpdate = async (_request, _reply) => {
    const data = await _request.jwtVerify();
    const id = data.user.user_id;
    const body = _.pick(_request.body, ['fullName', 'email', 'birthday']);
    const { error } = validateProfileUpdate(body.fullName, body.email, body.role, body.birthday);
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

profileCtrl.profilePasswordChange = async (_request, _reply) => {
    const data = await _request.jwtVerify();
    const id = data.user.user_id;
    const body = _.pick(_request.body, ['oldpass', 'newPass', 'reNewPass']);
    const { error } = validateChangePassword(body.oldpass, body.newPass, body.reNewPass);
    if (error) {
        return send(_request, _reply, error.details, 401);
    }
    try {
        const user = await userSchema.findById(id);
        if(!user){
            return send(_request, _reply, 'user does not found', 401);
        }
        console.log(user);
        if (!bcrypt.compareSync(body.oldpass, user.password)) {
            return send(_request, _reply, 'Invalid data', 401);
        }
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(body.newPass, salt);
        //const user = await userSchema.findByIdAndUpdate(id, body, { new: true });
        await user.save();
        return send(_request, _reply, 'ok', 201, user);
    } catch (err) {
        _request.log.error(err);
        return send(_request, _reply, 'Internal server error', 500);
    }
}

module.exports = { profileCtrl };