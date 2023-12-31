const {error } = require('../../helpers/responseApi');
require('../../helpers/common');
const { validationResult } = require('express-validator');
const User = require('../../models/user');
const Patient = require('../../models/patient');
const disponibility = require('../../models/disponibility');
const Dossier = require('../../models/Dossier');


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
    const nbPatients = await User.countDocuments({role: 'patient'});
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