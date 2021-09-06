const Joi = require('joi');

/**
 * @exports
 * @method validateId
 * @param { id }
 * @summary validate id
 * @returns
 */
function validateId(id) {
    return Joi.object({
        id: Joi
            .string()
            .required(),
    })
        .validate({
            id,
        },
            { allowUnknown: true });
}

/**
 * @exports
 * @method validateCode
 * @param { code }
 * @summary validate code
 * @returns
 */
function validateCode(code) {
    return Joi.object({
        code: Joi
            .string()
            .required(),
    })
        .validate({
            code,
        },
            { allowUnknown: true });
}

/**
 * @exports
 * @method validatePasswordChange
 * @param { email }
 * @summary validate email
 * @returns
 */
function validatePasswordChange(email) {
    return Joi.object({
        email: Joi
            .string()
            .email()
            .required(),
    })
        .validate({
            email,
        },
            { allowUnknown: true });
}

/**
 * @exports
 * @method validateSignin
 * @param { email }
 * @param { password }
 * @summary validate email password
 * @returns
 */
function validateSignin(email, password) {
    return Joi.object({
        email: Joi
            .string()
            .email()
            .required(),
        password: Joi
            .string()
            .required(),
    })
        .validate({ email, password }, { allowUnknown: true });
}

/**
 * @exports
 * @method validateSignup
 * @param { fullName }
 * @param { email }
 * @param { password }
 * @summary validate fullName, email, password
 * @returns
 */
function validateSignup(fullName, email, password) {
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
            .pattern(new RegExp('/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/'))
            .required()
    })
        .validate({
            fullName, email, password
        },
            { allowUnknown: true });
}

module.exports = {
    validateId,
    validateSignup,
    validateSignin,
    validatePasswordChange,
    validateCode
};