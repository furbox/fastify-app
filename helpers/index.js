const ObjectId = require('mongoose').Types.ObjectId;
const { send } = require('./response');


const isValidObjectId = (id, _request, _reply) => {
    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id) {
            return true
        }
        return send(_request, _reply, 'ID no valid', 401);
    }
    return send(_request, _reply, 'ID no valid', 401);
}

module.exports = { isValidObjectId };