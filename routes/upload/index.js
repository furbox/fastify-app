'use strict';

const { uploadsCtrl } = require('../../modules/uploads/uploads.ctrl');
// const fileUpload = require('fastify-file-upload');
const multer = require('fastify-multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = async function (fastify, opts) {
    // fastify.register(fileUpload)
    fastify.post('/image/:collection/:id', {
        preHandler: upload.single('file'),
        preValidation: [fastify.authenticate]
    }, uploadsCtrl.uploadFile.bind(this));
}