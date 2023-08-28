const router = require("express").Router();

const { forgot, reset } = require("../../app/controllers/api/ForgotPasswordController");

router.post("/forgot", forgot);
router.post("/reset", reset)
module.exports = router;