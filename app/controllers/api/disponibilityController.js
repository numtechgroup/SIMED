const Doctor = require('../../models/doctor')
const User = require('../../models/user')  
const Disponibility = require('../../models/disponibility')
const {success, error, validation } = require('../../helpers/responseApi');
const { validationResult } = require('express-validator');

let user;

exports.createDisponibility = async(req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
      return res.status(422).json(validation(errors.array()));
    const { date, timeslotes } = req.body;  

    const existDate = await Disponibility.findOne({date: date});

    if(existDate)
      return res.status(422).json(validation({message:"Vous avez deja programmé pour ce jour, choisissez une autre !"}));

    if(!date || !timeslotes[0].start || !timeslotes[0].end)
        return res.status(422).json(validation({message:"Date and/or time are required"}));

    if(timeslotes[0].start > timeslotes[0].end)
        return res.status(422).json(validation({message:"Le temps de fin consultation ne peut etre avant celui de debut"}));

    if(timeslotes[0].start < "08:00" || timeslotes[0].end > "13:00")
        return res.status(422).json(validation({message:"Le temps de consultation doit etre 8h et 13h"}));

    try {
        user = await User.findById(req.user.id).select("-password");
        if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
        if(user.role != "docteur"){
            return res.status(403).json(error("Accès non autorisé", res.statusCode));
        }else{
            let disponibility = new Disponibility({
                date: date,
                timeslotes: timeslotes,
                doctor: user
            })
            await disponibility.save();
            return res.status(200).json(success("Creation Réussie", { disponibility }, res.statusCode));
        }
    }
    } catch (err) {
        console.error(err.message);
      res.status(500).json(error("Erreur interne serveur", res.statusCode));
    }

};

exports.getAllDisponibilities = async function (req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty())
      return res.status(422).json(validation(errors.array()));
    try{
        user = await User.findById(req.user.id).select("-password");
  
      if (!user)
        return res.status(404).json(error("Pas d'utilisateur trouvé", res.statusCode));
      else{
            let disponibilities = await Disponibility.find({doctor: user});
            return res.status(200).json(success("Liste de mes disponibilités",{disponibilities}, res.statusCode));
        }
        
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};
