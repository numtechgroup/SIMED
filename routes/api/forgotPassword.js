const router = require("express").Router();

const { forgot, reset } = require("../../app/controllers/api/ForgotPasswordController");
const { auth } = require("../../app/middleware/auth");

router.post("/forgot",auth, forgot);
router.post("/reset", auth, reset)
module.exports = router;