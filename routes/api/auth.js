const router = require("express").Router();

const { register, verify, login, resendVerification, getAuthenticatedUser } = require("../../app/controllers/api/authcontroller");

const { registerValidation, loginValidation, auth } = require("../../app/middleware/auth");

router.post("/register", registerValidation, register);
router.get("/verify/:token", verify);
router.post("/login", loginValidation, login);
router.post("/verify/resend", resendVerification);
router.get("/", auth, getAuthenticatedUser);

module.exports = router;