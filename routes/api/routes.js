const router = require("express").Router();
const { getDoctors } = require("../../app/controllers/api/DoctorController");
const { getPatients } = require("../../app/controllers/api/PatientController");
const { getUsers } = require("../../app/controllers/api/UserController");
const { createDisponibility, getAllDisponibilities, deleteEvent } = require("../../app/controllers/api/disponibilityController");

const {authAdmin, authDoctor, authPatient } = require("../../app/middleware/auth")

router.get('/doctors',authPatient,getDoctors);

router.get('/patients',authDoctor, getPatients);

router.get('/users',authAdmin, getUsers);

router.post('/doctor/createDisponibility', authDoctor, createDisponibility);

router.get('/doctor/disponibilities', authDoctor, getAllDisponibilities);

router.delete('/doctor/disponibility/delete/:id',authDoctor, deleteEvent);


module.exports = router;