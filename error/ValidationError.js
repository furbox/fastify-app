/**
 * @exports
 * @extends Error
 */
class ValidationError extends Error {
    /**
     * @constructor
     * @param {object} message
     */
    constructor(message) {
        console.log(message[0])
        super();
        this.message = JSON.stringify(message);
        this.name = 'E_MISSING_OR_INVALID_PARAMS';
    }
}

module.exports = ValidationError;