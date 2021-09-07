const Joi = require('joi');

/**
 * @exports
 * @method validateUserCreate
 * @param fullName 
 * @param email 
 * @param password 
 * @param status 
 * @summary validate fullName, email, password, role, status
 * @returns
 */
function validateUserCreate(fullName, email, password, role, status) {
    return Joi.object({
        fullName: Joi
            .string()
            .required(),
        email: Joi
            .string()
            .email()
            .required(),
        password: Joi
            .string()
            .required()
            .pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
            .messages({ 'string.pattern.base': 'Required: 8 character minimum, min one Upper-case letter, min one Lower-case letter, min one digit, min one special character' }),
        role: Joi
            .string(),
        status: Joi
            .boolean(),
    })
        .validate({
            fullName, email, password, role, status,
        },
            { allowUnknown: true });
}

module.exports = {
    validateUserCreate
};