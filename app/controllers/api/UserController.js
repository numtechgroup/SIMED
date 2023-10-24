const {error } = require('../../helpers/responseApi');
require('../../helpers/common');
const { validationResult } = require('express-validator');
const User = require('../../models/user');


exports.getUsers = async(req, res) => {
    try{
        let users = await User.find({});
        if (users){
            return res.status(200).json(users);
        }
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};