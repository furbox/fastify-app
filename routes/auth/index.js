'use strict';

const authCtrl = require("../../modules/auth/auth.ctrl");
const PermissionsEnum = require("../../modules/permission/permission.enum");


module.exports = async function (fastify, opts) {
    fastify.post('/signup', authCtrl.signup);
    fastify.get('/validation/:code', authCtrl.verifyAccount);
    fastify.post('/signin', authCtrl.signin);
    fastify.post('/change-password', authCtrl.changePassword);
    fastify.get('/refresh-token', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.AUTH.refreshToken.namekey)] }, authCtrl.refreshToken);
}