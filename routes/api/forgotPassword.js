const router = require("express").Router();

const { forgot, reset } = require("../../app/controllers/api/ForgotPasswordController");
const { auth } = require("../../app/middleware/auth");

router.post("/forgot", forgot);
router.post("/reset", auth, reset)
module.exports = router;