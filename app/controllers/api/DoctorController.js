const {success, error, validation } = require('../../helpers/responseApi');
require('../../helpers/common');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Doctor = require('../../models/doctor');


exports.getDoctors = async(req, res) => {
    try{
        let users = await Doctor.find({});
        if (users){
            return res.status(200).json(users);
        }
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};