const Joi = require('joi');

/**
 * @exports
 * @method validateModuleCreate
 * @param name 
 * @param description 
 * @summary validate name, description
 * @returns
 */
function validateModuleCreate(name, description) {
    return Joi.object({
        name: Joi
            .string()
            .required(),
        description: Joi
            .string()
            .required(),
    })
        .validate({
            name, description
        },
            { allowUnknown: true });
}

module.exports = {
    validateModuleCreate
};