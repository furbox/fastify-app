'use strict';

const { Schema, model } = require('mongoose');

const authSchema = new Schema({
    token: { type: String, required: [true, 'Token is required'] },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User is required'],
        ref: 'User'
    }
}, {
    versionKey: false,
    timestamps: true
});

//Export the model
module.exports = model('Auth', authSchema);