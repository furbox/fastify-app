'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'User name is required'],
        index: true,
        minlength: 5,
        maxlength: 250
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        unique: true,
        minlength: 5,
        maxlength: 250
    },
    password: {
        type: String,
        required: [true, 'User password is required']
    },
    img: {
        type: String
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    },
    status: {
        type: Boolean,
        default: false
    },
    birthday: Date,
    lastdatelogin: { type: Date, default: Date.now },
    activationcode: {
        type: Boolean,
        default: false
    },
    codevalidate: {
        type: String
    },
    countlogin: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false,
    timestamps: true
});

userSchema.methods.toJSON = function () {
    const { __v, countlogin, google, activationcode, codevalidate, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

//Export the model
module.exports = mongoose.model('User', userSchema);