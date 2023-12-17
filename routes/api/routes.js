const router = require("express").Router();
const { getDoctors, getNumberOfDoctors, getStatisticsOfDoctors } = require("../../app/controllers/api/DoctorController");
const { getPatients, getStatisticsOfPatients } = require("../../app/controllers/api/PatientController");
const { getUsers } = require("../../app/controllers/api/UserController");
const { createAppointment, getAllAppointments, deleteAppointmentById, getAppointmentById } = require("../../app/controllers/api/appointmentController");
const { createDisponibility, getAllDisponibilities, deleteEvent } = require("../../app/controllers/api/disponibilityController");

const {authAdmin, authDoctor, authPatient } = require("../../app/middleware/auth")

//doctors
router.get('/doctors',authPatient,getDoctors);

router.post('/doctor/createDisponibility', authDoctor, createDisponibility);

router.get('/doctor/disponibilities', authDoctor, getAllDisponibilities);

router.delete('/doctor/disponibility/delete/:id',authDoctor, deleteEvent);

router.get('/doctors/statistics', authPatient, getStatisticsOfDoctors)


//patients
router.get('/patients',authDoctor, getPatients);

router.post('/patient/createAppointment', authPatient, createAppointment);

router.get('/patient/appointments',authPatient, getAllAppointments);

router.delete('/patient/appointment/delete/:id',authPatient, deleteAppointmentById);

router.get('/patient/appointment/:id',authPatient, getAppointmentById);

router.get('/patients/statistics', authDoctor, getStatisticsOfPatients)




// users
router.get('/users', authAdmin, getUsers);



module.exports = router;