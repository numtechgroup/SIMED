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
    email : {
        type: 'String',
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
    },
    password : {
        type: 'String',
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    role : {
        type: 'String',
        required: true,
        enum: ['patient', 'doctor','secretaire']
    },
    token : {
        type: 'String'
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

module.exports = mongoose.model('user', userschema);