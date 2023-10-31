const { error } = require('../../helpers/responseApi');
require('../../helpers/common');
const { validationResult } = require('express-validator');
const User = require('../../models/user');


exports.getUsers = async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
  
      if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        if(user.role != "admin"){
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }else{
            let users = await User.find({});
            return res.status(200).json(users);
        }
    }
        
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};