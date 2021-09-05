const format = (request, reply, message, data) => {
    const responseTimeStamp = reply.getResponseTime();

    const response = {
        requestId: request.id,
        message,
        responseTimeStamp,
        data,
    };

    return response;
};

const send = (request, reply, message, status, data) => {
    const statusCode = status || 200;
    const response = format(request, reply, message, data);
    return reply.status(statusCode).send(response);
};

module.exports.format = format;
module.exports.send = send;