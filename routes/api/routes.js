const router = require("express").Router();
const { getDoctors } = require("../../app/controllers/api/DoctorController");
const { getPatients } = require("../../app/controllers/api/PatientController");
const { getUsers } = require("../../app/controllers/api/UserController");
const {authAdmin, authDoctor, authPatient } = require("../../app/middleware/auth")

router.get('/doctors',authPatient,getDoctors);

router.get('/patients',authDoctor, getPatients);

router.get('/users',authAdmin, getUsers);

module.exports = router;