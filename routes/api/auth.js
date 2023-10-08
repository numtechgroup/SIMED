const router = require("express").Router();

const { register, login, getAuthenticatedUser, registerDoctor, loginDoctor } = require("../../app/controllers/api/authcontroller");

const { registerValidation, loginValidation, auth } = require("../../app/middleware/auth");

router.post("/register", registerValidation, register);

router.post("/addDoctor", registerValidation, registerDoctor);
// router.get("/verify/:token", verify);
router.post("/login", loginValidation, login);

router.post("/loginDoctor", loginValidation, loginDoctor);

// router.post("/verify/resend", resendVerification);
router.get("/", auth, getAuthenticatedUser);

module.exports = router;