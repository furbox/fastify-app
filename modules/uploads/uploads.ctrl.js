'use strict';

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CDN_CLOUD_NAME,
    api_key: process.env.CDN_API_KEY,
    api_secret: process.env.CDN_API_SECRET
});
const { getUserById } = require("../user/user.ctrl");
const { send } = require('../../helpers/response');

const uploadsCtrl = {};

uploadsCtrl.uploadFile = async (_request, _reply) => {
    const { id, collection } = _request.params;
    let modelo;

    switch (collection) {
        case 'users':
            modelo = await getUserById(id, _request, _reply)
            break;
        default:
            return send(_request, _reply, 'Internal server error', 500);
    }

    //Borrar imagenes previas
    if (modelo.img) {
        //borrar imagen del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    console.log(_request.files)
    const binaryData = _request.file.buffer;
    console.log(binaryData);
    // const { tempFilePath } = _request.raw.files.archivo;
    // const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    const result = await uploadPicture(binaryData) // Watch below for details

    modelo.img = result.url;

    await modelo.save();

    return send(_request, _reply, 'ok', 201)
}

const uploadPicture = (content) => {
    console.log(content)
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'fastify',
                // eager: [{ width: 400, height: 400, crop: 'crop', gravity: 'face' }]
            }, (error, result) => {
                if (error) {
                    throw Exception('Upload failed')
                } else {
                    resolve(result)
                }
            }
        ).end(content)
    })
}

module.exports = { uploadsCtrl };