const bcrypt = require('bcryptjs');
const profileCtrl = {};
const { isValidObjectId } = require('../../helpers');
const _ = require('underscore');
const { send } = require('../../helpers/response');
const { validatePagination, validateId } = require('../../helpers/validations');
const { validateProfileUpdate, validateChangePassword } = require('./profile.validation');

profileCtrl.profileUpdate = async () => { }

profileCtrl.profilePasswordChange = async () => { }

module.exports = { profileCtrl };