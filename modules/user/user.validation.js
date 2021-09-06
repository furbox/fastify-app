const Joi = require('joi');

/**
 * @exports
 * @method validateId
 * @param  id 
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

/**
 * @exports
 * @method validatePagination
 * @param  limit
 * @param  page
 * @param  status
 * @summary validate limit page status
 * @returns
 */
function validatePagination(limit, page, status) {
    return Joi.object({
        limit: Joi
            .number(),
        page: Joi
            .number(),
        status: Joi
            .boolean(),
    })
        .validate({
            limit, page, status,
        },
            { allowUnknown: true });
}

module.exports = {
    validateId,
    validateUserCreate,
    validatePagination
};