const Joi = require('joi');

/**
 * @exports
 * @method validateProfileUpdate
 * @param fullName 
 * @param email 
 * @param birthday 
 * @summary validate fullName, email, birthday
 * @returns
 */
function validateProfileUpdate(fullName, email, birthday) {
    return Joi.object({
        fullName: Joi
            .string()
            .required(),
        email: Joi
            .string()
            .email()
            .required(),
        birthday: Joi
            .date()
    })
        .validate({
            fullName, email, birthday,
        },
            { allowUnknown: true });
}

/**
 * @exports
 * @method validateChangePassword
 * @param oldpass 
 * @param newPass 
 * @param reNewPass 
 * @summary validate oldpass, newPass, reNewPass
 * @returns
 */
function validateChangePassword(oldpass, newPass, reNewPass) {
    return Joi.object({
        oldpass: Joi
            .string()
            .required(),
        newPass: Joi
            .string()
            .required()
            .pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
            .messages({ 'string.pattern.base': 'Required: 8 character minimum, min one Upper-case letter, min one Lower-case letter, min one digit, min one special character' }),
        reNewPass: Joi
            .ref('newPass')
    })
        .validate({
            oldpass, newPass, reNewPass,
        },
            { allowUnknown: true });
}

module.exports = {
    validateProfileUpdate,
    validateChangePassword
};