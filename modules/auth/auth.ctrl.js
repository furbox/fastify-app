const authCtrl = {};
const roleSchema = require('../role/role.schema');
const userSchema = require('../user/user.schema');

authCtrl.signin = async (_request, _reply) => {}

authCtrl.signup = async (_request, _reply) => {}

authCtrl.changePassword = async (_request, _reply) => {}

authCtrl.verifyAccount = async (_request, _reply) => {}

authCtrl.refreshToken = async (_request, _reply) => {}

authCtrl.addTokenUser = async (_request, _reply) => {}

module.exports = authCtrl;