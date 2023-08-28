const { check } = require('express-validator');
const { error } = require('../helpers/responseApi');
const jwt = require('jsonwebtoken')
const config = require('config');

exports.registerValidation = [
    check("email","votre email est requis").not().isEmpty(),
    check("password","votre mot de passe est requis").not().isEmpty(),
];

exports.loginValidation = [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ];


exports.auth = async(req, res, next) => {
    const authorizedHeader = req.header("Authorization");

    const splitAuthorizationHeader = authorizedHeader.split(" ");

    const bearer = splitAuthorizationHeader[0];
    const token = splitAuthorizationHeader[1];

    if(bearer !== "Bearer")
        return res.status(400).json(error("Le type de token doit etre Bearer !", res.statusCode));

    if (!token)
        return res.status(400).json(error("Aucun token trouvé"));

    try {
        const jwtData = await jwt.verify(token, config.get("jwtSecret"));
        
        if (!jwtData) return res.status(400).json(error("Accès non authorisé !"));

        req.user = jwtData.user

        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json(error("Non authorizé !", res.statusCode));
    }
};