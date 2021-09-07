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
    validatePagination
};