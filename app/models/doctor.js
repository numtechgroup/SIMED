const mongoose = require('mongoose');

const doctorschema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    specialite : {
        type: 'String',
        default : null
    },
    hopital : {
        type: 'String',
        default : null,
        minlength: 5,
        maxlength: 255, 
    },
});

module.exports = mongoose.model('Doctor', doctorschema);