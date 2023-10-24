const mongoose = require('mongoose');

const doctorschema = new mongoose.Schema({
    prenom_nom : {
        type: 'String',
        default: null,
        required: true,
        maxlength: 255,
    },
    genre : {
        type: 'String',
        enum:['Masculin','Feminin'],
    },
    addresse : {
        type: 'String',
        required: true,
        minlength: 5,
        maxlength: 255, 
    },
    telephone : {
        type: 'String',
        required: true,
        minlength: 5,
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
        default: 'patient',
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

module.exports = mongoose.model('Patient', doctorschema);