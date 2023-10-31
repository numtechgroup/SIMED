const {success, error, validation } = require('../../helpers/responseApi');
require('../../helpers/common');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Doctor = require('../../models/doctor');


exports.getDoctors = async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
  
      if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        if(user.role != "patient"){
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }else{
            let doctors = await Doctor.find({});
            return res.status(200).json(doctors);
        }
    }
        
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};