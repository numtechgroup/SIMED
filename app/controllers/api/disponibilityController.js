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

    const {titre, startDate, endDate } = req.body;  

    const startDateWithoutTime = new Date(startDate);
    startDateWithoutTime.setUTCHours(0, 0, 0, 0); // Set time to midnight
    
    const endDateWithoutTime = new Date(endDate);
    endDateWithoutTime.setUTCHours(0, 0, 0, 0); // Set time to midnight
    
    const existDate = await Disponibility.findOne({
      startDate: {
        $gte: startDateWithoutTime,
        $lt: new Date(endDateWithoutTime.getTime() + 24 * 60 * 60 * 1000),
      },
      doctor: req.user.id, // Ajout de la condition pour le médecin actuel
    });

    if(existDate)
      return res.status(422).json(validation({message:"Vous avez deja programmé pour ce jour, choisissez une autre date !"}));

    if(!startDate || !endDate)
        return res.status(422).json(validation({message:"Date and/or time are required"}));

    if (startDateWithoutTime > endDateWithoutTime)
        return res.status(422).json(validation({ message: "La date de fin consultation ne peut être avant celle de début" }));

    const startTime = new Date(startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if(startTime > endTime)
        return res.status(422).json(validation({message:"Le temps de fin consultation ne peut etre avant celui de debut"}));

    if(startTime < "08:00" || endTime > "13:00")
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
                titre: titre,
                start: startDate,
                end: endDate,
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
            return res.status(200).json(disponibilities);
        }
        
    }catch (err) {
      console.error(err.message);
      res.status(500).json(error("Erreur serveur interne", res.statusCode));
    }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  const existDispo = await Disponibility.findById(id);

  if (!existDispo) return res.status(404).send(`No event with id: ${id}`);

  await Disponibility.findByIdAndRemove(id);

  res.json({ message: "Event deleted successfully." });
}
