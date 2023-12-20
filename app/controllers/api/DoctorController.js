const {success, error } = require('../../helpers/responseApi');
const appointment = require('../../models/appointment');
const disponibility = require('../../models/disponibility');
require('../../helpers/common');
require('express-validator');
const User = require('../../models/user');



exports.getDoctors = async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
  
      if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        if(user.role != "patient"){
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }else{
            let doctors = await User.find({role:'docteur'});
            return res.status(200).json(doctors);
        }
    }
        
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};

exports.getStatisticsOfDoctors = async(req, res) => {
    try {
     const nbDoctors = await User.countDocuments({role: 'docteur'});
     const user = await User.findById(req.user.id).select("-password");
     if(!user) 
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        const dispos = await appointment.countDocuments({patient: user});
        return res.status(200).json({"doctors":nbDoctors, "appointments":dispos});
      }

    } catch (error) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};

