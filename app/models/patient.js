const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    groupeSanguin: {
        type: String,
        default: null
    }

});

module.exports = mongoose.model('Patient', patientSchema);