const {error, validation, success} = require('../../helpers/responseApi');
require('../../helpers/common');
const { validationResult } = require('express-validator');
const User = require('../../models/user');
const Patient = require('../../models/patient');
const disponibility = require('../../models/disponibility');
const Dossier = require('../../models/Dossier');
const bcrypt = require("bcryptjs");
const Doctor = require("../../models/doctor");


exports.createPatient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json(validation(errors.array()));

    const { prenom, nom, genre, adresse, telephone, groupeSanguin, email } = req.body;

    try {
        const loggedInUser = await User.findById(req.user.id).select("-password");

        if (!loggedInUser)
            return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));

        if (loggedInUser.role !== "docteur") {
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }

        let existingPatient = await Patient.findOne({ telephone: telephone });

        if (existingPatient) {
            return res.status(401).json(error("Ce patient existe déjà !", res.statusCode));
        }

        let newPatient = new Patient({
            prenom,
            nom,
            genre,
            adresse,
            telephone,
            groupeSanguin,
            email
        });
        await newPatient.save();

        // let newUser = new User({
        //     prenom,
        //     nom,
        //     genre,
        //     adresse,
        //     telephone,
        //     role:'patient',
        //     groupeSanguin,
        //     email
        // });
        // await newUser.save();

        res.status(201).json(
            success(
                "Ajout réussi !",
                {
                    Patient: {
                        id: newPatient._id,
                        prenom: newPatient.prenom,
                        nom: newPatient.nom,
                        genre: newPatient.genre,
                        adresse: newPatient.adresse,
                        telephone: newPatient.telephone,
                        groupeSanguin: newPatient.groupeSanguin,
                        email:newPatient.email,
                        role:newPatient.role,
                        createdAt: newPatient.createdAt,
                    },
                },
                res.statusCode
            )
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json(error("Erreur interne serveur", res.statusCode));
    }
};



exports.getPatients = async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
  
      if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        if(user.role != "docteur"){
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }else{
            let patients = await Patient.find({});
            return res.status(200).json(patients);
        }
    }
        
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};

exports.getStatisticsOfPatients = async(req, res) => {
  try {
    const nbPatients = await Patient.countDocuments({});
    const user = await User.findById(req.user.id).select("-password");
    if(!user) 
       return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
     else{
       const dispos = await disponibility.countDocuments({doctor: user});
       const dossiers = await Dossier.countDocuments({});
       return res.status(200).json({"patients":nbPatients, "dispos":dispos, "dossiers":dossiers});
     }

   } catch (error) {
     console.error(err.message);
     res.status(500).json(error("Erreur serveur interne", res.statusCode));
   }
};

exports.getPatientById = async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");

        if (!user)
            return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
        else{
            if(user.role != "docteur"){
                return res.status(403).json(error("Accès non autorisé", res.statusCode));
            }else{
                let patient = await Patient.findById(req.params.id);
                return res.status(200).json(patient);
            }
        }

    }catch (err) {
        console.error(err.message);
        res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};


