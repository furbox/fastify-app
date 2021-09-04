'use strict';

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Role Name Is Required'] },
    description: { type: String, required: [true, 'Role Description Is Required'] },
    status: { type: Boolean, default: true, required: [true, 'Role Status Is Required'] },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
}, {
    versionKey: false,
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Role', roleSchema);