const router = require("express").Router();
const { getDoctors } = require("../../app/controllers/api/DoctorController");
const { getPatients } = require("../../app/controllers/api/PatientController");
const { getUsers } = require("../../app/controllers/api/UserController");

router.get('/doctors', getDoctors);

router.get('/patients', getPatients);

router.get('/users', getUsers);

module.exports = router;