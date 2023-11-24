const router = require("express").Router();
const { resendVerification, login, getAuthenticatedUser, verify, registerUser } = require("../../app/controllers/api/authcontroller");
const { loginValidation, authAdmin, authDoctor, authPatient } = require("../../app/middleware/auth");

router.post("/addUser", authAdmin, registerUser);

router.get("/verify/:token", verify);

router.post("/login", loginValidation, login);

router.post("/verify/resend", resendVerification);

router.get("/", authAdmin, getAuthenticatedUser);

router.get("/users", authAdmin, getAuthenticatedUser);






module.exports = router;