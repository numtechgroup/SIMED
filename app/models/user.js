const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    prenom : {
        type: 'String',
        default: null,
        required: true,
        maxlength: 255,
    },
    nom : {
        type: 'String',
        default: null,
        required: true,
        maxlength: 255,
    },
    genre : {
        type: 'String',
        enum : ['Masculin', 'Feminin']
    },
    adresse : {
        type: 'String',
        default: null,
        required: true,
        maxlength: 255,
    },
    telephone : {
        type: 'String',
        default: null,
        required: true,
        maxlength: 255,
    },
    email : {
        type: 'String',
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
        validate: {
            validator: function (v) {
                return v !== null;
            },
            message: 'Email is required and cannot be null.',
        },
    },
    password : {
        type: 'String',
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    new_password : {
        type: 'String',
        required: false,
        minlength: 5,
        maxlength: 255,
    },
    role : {
        type: 'String',
        enum: ['patient', 'docteur','admin']
    },
    token : {
        type: 'String'
    },
    verificationCode:{
        type: 'String',
        required: false,
    },
    verified: {
        type: Boolean,
        default: false,
      },
    verifiedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('User', userschema);