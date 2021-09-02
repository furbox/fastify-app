'use strict';

const authCtrl = require("../../modules/auth/auth.ctrl");


module.exports = async function (fastify, opts) {
    fastify.post('/signup', authCtrl.signup);
    fastify.get('/validation/:code', authCtrl.verifyAccount);
}