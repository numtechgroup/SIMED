const { check } = require('express-validator');
const { error } = require('../helpers/responseApi');
const jwt = require('jsonwebtoken')
const config = require('config');

exports.registerValidation = [
    check("email","votre email est requis").not().isEmpty(),
    check("password","votre mot de passe est requis").not().isEmpty(),
];

exports.loginValidation = [
    check("email", "votre email est requis").not().isEmpty(),
    check("password", "votre mot de passe est requis").not().isEmpty(),
  ];

  exports.auth = async(req, res, next) => {
    const authorizedHeader = req.header("Authorization");
    var splitAuthorizationHeader;
    var bearer;
    var token;

    if (authorizedHeader)
        splitAuthorizationHeader = authorizedHeader.split(" ");

    if (splitAuthorizationHeader){
        bearer = splitAuthorizationHeader[0];
        token = splitAuthorizationHeader[1];
    }

    

    if(bearer !== "Bearer")
        return res.status(400).json(error("Le type de token doit etre Bearer !", res.statusCode));

    if (!token)
        return res.status(400).json(error("Aucun token trouvé"));
    try {
        const jwtData = await jwt.verify(token, config.get("jwtSecret"));
        if (!jwtData) return res.status(400).json(error("Token non authorisé !"));

        req.user = jwtData.user

        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json(error("Non authorisé !", res.statusCode));
    }
};

exports.authAdmin = async(req, res, next) => {
    const authorizedHeader = req.header("Authorization");
    var splitAuthorizationHeader;
    var bearer;
    var token;

    if (authorizedHeader)
        splitAuthorizationHeader = authorizedHeader.split(" ");

    if (splitAuthorizationHeader){
        bearer = splitAuthorizationHeader[0];
        token = splitAuthorizationHeader[1];
    }

    

    if(bearer !== "Bearer")
        return res.status(400).json(error("Le type de token doit etre Bearer !", res.statusCode));

    if (!token)
        return res.status(400).json(error("Aucun token trouvé"));
    try {
        const jwtData = await jwt.verify(token, config.get("jwtSecret"));
        if (!jwtData) return res.status(400).json(error("Token non authorisé !"));

        if(jwtData.user.role !== 'admin') return res.status(403).json(error("Accès non autorisé, vous n'etes pas admin!"));

        req.user = jwtData.user

        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json(error("Non authorisé !", res.statusCode));
    }
};

exports.authPatient = async(req, res, next) => {
    const authorizedHeader = req.header("Authorization");
    var splitAuthorizationHeader;
    var bearer;
    var token;

    if (authorizedHeader)
        splitAuthorizationHeader = authorizedHeader.split(" ");

    if (splitAuthorizationHeader){
        bearer = splitAuthorizationHeader[0];
        token = splitAuthorizationHeader[1];
    }

    

    if(bearer !== "Bearer")
        return res.status(400).json(error("Le type de token doit etre Bearer !", res.statusCode));

    if (!token)
        return res.status(400).json(error("Aucun token trouvé"));
    try {
        const jwtData = await jwt.verify(token, config.get("jwtSecret"));
        if (!jwtData) return res.status(400).json(error("Token non authorisé !"));

        if(jwtData.user.role !== 'patient') return res.status(403).json(error("Accès non autorisé, vous n'etes pas patient!"));

        req.user = jwtData.user

        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json(error("Non authorisé !", res.statusCode));
    }
};

exports.authDoctor = async(req, res, next) => {
    const authorizedHeader = req.header("Authorization");
    var splitAuthorizationHeader;
    var bearer;
    var token;

    if (authorizedHeader)
        splitAuthorizationHeader = authorizedHeader.split(" ");

    if (splitAuthorizationHeader){
        bearer = splitAuthorizationHeader[0];
        token = splitAuthorizationHeader[1];
    }

    

    if(bearer !== "Bearer")
        return res.status(400).json(error("Le type de token doit etre Bearer !", res.statusCode));

    if (!token)
        return res.status(400).json(error("Aucun token trouvé"));
    try {
        const jwtData = await jwt.verify(token, config.get("jwtSecret"));
        if (!jwtData) return res.status(400).json(error("Token non authorisé !"));

        if(jwtData.user.role !== 'docteur') return res.status(403).json(error("Accès non autorisé, vous n'etes pas docteur!"));

        req.user = jwtData.user

        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json(error("Non authorisé !", res.statusCode));
    }
};