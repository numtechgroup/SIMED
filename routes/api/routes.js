const router = require("express").Router();
const { getDoctors } = require("../../app/controllers/api/DoctorController");
const { getPatients } = require("../../app/controllers/api/PatientController");
const { getUsers } = require("../../app/controllers/api/UserController");
const { auth } = require("../../app/middleware/auth")

router.get('/doctors',auth,getDoctors);

router.get('/patients',auth, getPatients);

router.get('/users',auth, getUsers);

module.exports = router;