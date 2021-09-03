'use strict';

const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Permission Name Is Required'] },
    namekey: { type: String, unique: true, required: [true, 'Permission Key Is Required'] },
    description: { type: String, required: [true, 'Permission Description Is Required'] },
    status: { type: Boolean, default: true, required: [true, 'Permission Status Is Required'] },
}, {
    versionKey: false,
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Permission', permissionSchema);