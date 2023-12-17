const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  timeAppointment: {
    type: String,
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Patient',
		required: true,
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
