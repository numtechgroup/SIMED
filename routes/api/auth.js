const router = require("express").Router();
const { resendVerification, login, getAuthenticatedUser, logout, verify, registerUser, loginDoctor } = require("../../app/controllers/api/authcontroller");
const { registerValidation, loginValidation, auth } = require("../../app/middleware/auth");

// router.post("/register", registerValidation, register);

// router.post("/addDoctor", registerValidation, registerDoctor);

// router.post("/loginDoctor", loginValidation, loginDoctor);

router.post("/addUser", registerUser);

router.get("/verify/:token", verify);

router.post("/login", loginValidation, login);

router.get('/logout', logout);

router.post("/verify/resend", resendVerification);

router.get("/", auth, getAuthenticatedUser);

router.get("/users", auth, getAuthenticatedUser);






module.exports = router;