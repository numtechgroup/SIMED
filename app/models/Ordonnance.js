const mongoose = require('mongoose');

const ordonnanceSchema = mongoose.Schema({
    nomOrdonnance:{
      type: String,
      required: false
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
});

const Ordonnance = mongoose.model('Ordonnance', ordonnanceSchema);

module.exports = Ordonnance;
