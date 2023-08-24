require("dotenv").config();
require("./config/database").connect();

const auth = require("./middleware/auth");
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const User = require("./model/user");
const bcrypt = require("bcryptjs/dist/bcrypt");

const user_signup = async (req, role, res) =>{
    try {
        
        const { prenom, nom, email, password } = req.body;

        if(!(email && password && prenom && nom)){
            res.status(400).send("Tous les champs sont requis !");
    }

    const olduser = await User.findOne({ email: email });

    if (olduser) {
        return res.status(409).send("Utilisateur deja existant, Veuillez vous connecter !");
    }
    
    encryptedPassword = await bcrypt.hash(password, 12);
    

    const user = await User.create({
        prenom,
        nom,
        email: email.toLowerCase(),
        password:  encryptedPassword,
        role
    });

    const token = jwt.sign(
        {user_id: user._id, email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h"
        }
    );

    user.token = token;

    res.status(201).json(user);
    
}
    catch (error) {
        console.error(error);
    }
};

const user_signin = async(req, role, res) =>{
    try {
        const { email, password } = req.body;
        if(!(email && password)){
            res.status(400).send("Tous les champs sont requis !");
        }
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            res.status(400).send("Ce compte n'existe pas, veuillez  en créer un !");
        }

        if(user.role !=  role){
            return res.status(403).json({
                message: "Soyez sûr que vous êtes sur le bon portail !"
              });
        }

        if (user && ( await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                {
                    user_id: user._id,
                    email,
                    role : user.role
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                });
                user.token = token;

                res.status(200).json(user);
        }else{
            res.status(200).send("Email et/ou Mot de passe Invalide, Veuillez verifier vos informations!");
        }
    } catch (error) {
            console.log(error);
    }
};

const checkRole = (roles) => async (req, res, next) => {
    let { email } = req.body;
  
    //retrieve employee info from DBs
    const user = await User.findOne({ email });
    !roles.includes(req.user.role)
      ? res.status(401).json("Desolé, vous n'avez pas accès à cette route !")
      : next();
  };


app.post("/registerPatient", (req, res) => {
    user_signup(req, "patient", res);
});

app.post("/loginAdmin", (req, res) => {
    user_signup(req, "admin", res);
});

app.post("/loginDoctor", (req, res) => {
    user_signin(req, "doctor", res);
});

app.post("/loginPatient", (req, res) => {
    user_signin(req, "patient", res);
});

app.get("/homeDoctor", auth, checkRole(["doctor"]), async (req, res) => {
    return res.json(`welcome ${req.body.prenom}`);
});

app.get("/homePatient", auth, checkRole(["patient"]), async (req, res) => {
    return res.json(`welcome to patient dashboard`);
});

app.get("/homeAdmin", auth, checkRole(["admin"]), async (req, res) => {
    return res.json(`welcome ${req.query.prenom}`);
});

app.post("/logout", auth, (req, res) => {
    req.body.token = null;
    res.status(200).json(req.body);
});

app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

module.exports = app;