const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    prenom : {type: 'String', default: null},
    nom : {type: 'String', default: null},
    email : {type: 'String', unique: true},
    password : {type: 'String'},
    role : {type: 'String', enum: ['admin', 'patient', 'doctor']},
    token : {type: 'String'},
});
    
module.exports = mongoose.model('user', userschema);