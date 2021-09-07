const Joi = require('joi');

/**
 * @exports
 * @method validatePermissionCreate
 * @param name 
 * @param namekey 
 * @param description 
 * @param module 
 * @summary validate name, namekey, description, module
 * @returns
 */
function validatePermissionCreate(name, namekey, description, module) {
    return Joi.object({
        name: Joi
            .string()
            .required(),
        namekey: Joi
            .string()
            .required(),
        description: Joi
            .string()
            .required(),
        module: Joi
            .string()
            .required(),
    })
        .validate({
            name, namekey, description, module
        },
            { allowUnknown: true });
}

module.exports = {
    validatePermissionCreate
};