const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
    unique: false,
  },
  patient: {
    type: String, // stocker l'ID du patient ou d'autres informations pertinentes
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Référence au modèle Doctor pour lier le rendez-vous à un médecin
    required: true,
  },
  timeAppointment: {
    type: String,
    required: true
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
