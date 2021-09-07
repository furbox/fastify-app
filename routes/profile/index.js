'use strict';

const PermissionsEnum = require('../../modules/permission/permission.enum');
const { profileCtrl } = require('../../modules/profile/profile.ctrl');

module.exports = async function (fastify, opts) {

    fastify.post('/update-profile', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.PROFILE.profileUpdate.namekey)] }, profileCtrl.profileUpdate);
    fastify.post('/change-password', { preValidation: [fastify.authenticate, fastify.authPermission(PermissionsEnum.PROFILE.profilePasswordChange.namekey)] }, profileCtrl.profilePasswordChange);
}