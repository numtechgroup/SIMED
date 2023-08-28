// require("dotenv").config();
// require("./config/database").connect();

// const auth = require("./app/middleware/auth");
// const express = require("express");
// const jwt = require("jsonwebtoken");

// const app = express();

// app.use(express.json());


// const checkRole = (roles) => async (req, res, next) => {
//     let { email } = req.body;
  
//     //retrieve employee info from DBs
//     const user = await User.findOne({ email });
//     !roles.includes(req.user.role)
//       ? res.status(401).json("Desolé, vous n'avez pas accès à cette route !")
//       : next();
//   };


// app.post("/registerPatient", (req, res) => {
//     user_signup(req, "patient", res);
// });

// app.post("/loginAdmin", (req, res) => {
//     user_signup(req, "admin", res);
// });

// app.post("/loginDoctor", (req, res) => {
//     user_signin(req, "doctor", res);
// });

// app.post("/loginPatient", (req, res) => {
//     user_signin(req, "patient", res);
// });

// app.get("/homeDoctor", auth, checkRole(["doctor"]), async (req, res) => {
//     return res.json(`welcome ${req.body.prenom}`);
// });

// app.get("/homePatient", auth, checkRole(["patient"]), async (req, res) => {
//     return res.json(`welcome to patient dashboard`);
// });

// app.get("/homeAdmin", auth, checkRole(["admin"]), async (req, res) => {
//     return res.json(`welcome ${req.query.prenom}`);
// });

// app.post("/logout", auth, (req, res) => {
//     req.body.token = null;
//     res.status(200).json(req.body);
// });

// app.get("/welcome", auth, (req, res) => {
//     res.status(200).send("Welcome 🙌 ");
// });

// module.exports = app;