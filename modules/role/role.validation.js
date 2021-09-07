const Joi = require('joi');

/**
 * @exports
 * @method validateName
 * @param { name }
 * @summary validate name
 * @returns
 */
function validateName(name) {
    return Joi.object({
        name: Joi
            .string()
            .required(),
    })
        .validate({
            name,
        },
            { allowUnknown: true });
}

/**
 * @exports
 * @method validateRole
 * @param { name }
 * @param { description }
 * @summary validate title, description
 * @returns
 */
function validateRole(name, description) {
    return Joi.object({
        name: Joi
            .string()
            .required(),
        description: Joi
            .string()
            .required()
    })
        .validate({
            name,
            description
        },
            { allowUnknown: true });
}

module.exports = {
    validateRole,
    validateName
};