const {success, error, validation } = require('../../helpers/responseApi');
require('../../helpers/common');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Patient = require('../../models/patient');


exports.getPatients = async(req, res) => {
    try{
        let patients = await Patient.find({});
        if (patients){
            return res.status(200).json(patients);
        }
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};