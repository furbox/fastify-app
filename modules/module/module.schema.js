'use strict';

const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: [true, 'Module Name Is Required'] },
    description: { type: String, required: [true, 'Module Description Is Required'] },
    status: { type: Boolean, default: true, required: [true, 'Role Status Is Required'] },
}, {
    versionKey: false,
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Module', moduleSchema);