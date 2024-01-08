const router = require("express").Router();
const { getDoctors, getNumberOfDoctors, getStatisticsOfDoctors } = require("../../app/controllers/api/DoctorController");
const { createDossierOphtalmo, getAllDossiers, deleteDossierById, getDossierById, upload, updateDossier} = require("../../app/controllers/api/DossierController");
const { getPatients, getStatisticsOfPatients, createPatient, getPatientById} = require("../../app/controllers/api/PatientController");
const { getUsers } = require("../../app/controllers/api/UserController");
const { createAppointment, getAllAppointments, deleteAppointmentById, getAppointmentById } = require("../../app/controllers/api/appointmentController");
const { createDisponibility, getAllDisponibilities, deleteEvent } = require("../../app/controllers/api/disponibilityController");

const {authAdmin, authDoctor, authPatient } = require("../../app/middleware/auth")
const {generateOrdonnance} = require("../../app/controllers/api/OrdonnanceController");

//doctors
router.get('/doctors',authPatient,getDoctors);

router.post('/doctor/createDisponibility', authDoctor, createDisponibility);

router.post('/doctor/addPatient', authDoctor, createPatient);

router.get('/doctor/disponibilities', authDoctor, getAllDisponibilities);

router.delete('/doctor/disponibility/delete/:id',authDoctor, deleteEvent);

router.get('/doctors/statistics', authPatient, getStatisticsOfDoctors)

router.post('/doctor/createDossier', createDossierOphtalmo);

router.post('/doctor/createOrdonnance', generateOrdonnance);

router.put('/doctor/dossier/update/:id', updateDossier);



router.get('/doctor/dossiers/all', authDoctor, getAllDossiers)

router.get('/doctor/dossier/:id',authDoctor, getDossierById);

router.delete('/doctor/dossier/delete/:id',authDoctor, deleteDossierById);




//patients
router.get('/patients',authDoctor, getPatients);

router.post('/patient/createAppointment', authPatient, createAppointment);

router.get('/patient/appointments',authPatient, getAllAppointments);

router.delete('/patient/appointment/delete/:id',authPatient, deleteAppointmentById);

router.get('/patient/appointment/:id',authPatient, getAppointmentById);

router.get('/patients/statistics', authDoctor, getStatisticsOfPatients)

router.get('/patient/:id', authDoctor, getPatientById)




// users
router.get('/users', authAdmin, getUsers);



module.exports = router;
