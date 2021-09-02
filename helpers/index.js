const ObjectId = require('mongoose').Types.ObjectId;


const isValidObjectId = (id, _reply) => {
    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id) {
            return true
        }
        return _reply.code(401).send({
            msg: 'ID no valid'
        });
    }
    return _reply.code(401).send({
        msg: 'ID no valid'
    });
}

module.exports = { isValidObjectId };